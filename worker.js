import { betterAuth } from 'better-auth';
import { ALLOWED_STATUSES, bookingDateIsFuture, parseAdminIds, parseBookingInput } from './domain.js';

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...extraHeaders } });
}

function errorResponse(error, fallbackStatus = 400) {
  const code = error?.code || error?.message || 'BAD_REQUEST';
  const status = code === 'INVALID_DATE' ? 400 : fallbackStatus;
  return json({ error: code }, status);
}

function buildAuth(env) {
  const baseURL = env.BETTER_AUTH_URL || 'http://localhost:8787';
  return betterAuth({
    database: env.DB,
    baseURL,
    basePath: '/api/auth',
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [baseURL],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      requireEmailVerification: false,
      autoSignIn: true,
    },
    user: {
      modelName: 'clearly_user',
      fields: { emailVerified: 'email_verified', createdAt: 'created_at', updatedAt: 'updated_at' },
    },
    session: {
      modelName: 'clearly_session',
      fields: {
        userId: 'user_id', expiresAt: 'expires_at', ipAddress: 'ip_address', userAgent: 'user_agent',
        createdAt: 'created_at', updatedAt: 'updated_at',
      },
    },
    account: {
      modelName: 'clearly_account',
      fields: {
        userId: 'user_id', accountId: 'account_id', providerId: 'provider_id', accessToken: 'access_token',
        refreshToken: 'refresh_token', accessTokenExpiresAt: 'access_token_expires_at',
        refreshTokenExpiresAt: 'refresh_token_expires_at', scope: 'scope', idToken: 'id_token',
        password: 'password', createdAt: 'created_at', updatedAt: 'updated_at',
      },
    },
    verification: {
      modelName: 'clearly_verification',
      fields: { expiresAt: 'expires_at', createdAt: 'created_at', updatedAt: 'updated_at' },
    },
    advanced: { database: { generateId: 'uuid' } },
  });
}

function sameOrigin(request, env) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const allowed = new Set([new URL(request.url).origin]);
  if (env.BETTER_AUTH_URL) {
    try { allowed.add(new URL(env.BETTER_AUTH_URL).origin); } catch {}
  }
  return allowed.has(origin);
}

async function getSession(auth, request) {
  return auth.api.getSession({ headers: request.headers });
}

function isAdmin(env, userId) {
  return parseAdminIds(env.ADMIN_USER_IDS).has(userId);
}

function normalizeBooking(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    address: row.address,
    type: row.type,
    area: row.area,
    extras: row.extras,
    currency: row.currency,
    amount: row.amount,
    date: row.date,
    time: row.time,
    comment: row.comment || '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function requireSession(auth, request) {
  const session = await getSession(auth, request);
  if (!session?.user?.id) return null;
  return session;
}

async function listUserBookings(env, userId) {
  const result = await env.DB.prepare(`
    SELECT id, name, phone, address, type, area, extras, currency, amount, date, time, comment, status, created_at, updated_at
    FROM clearly_booking
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 200
  `).bind(userId).all();
  return (result.results || []).map(normalizeBooking);
}

async function listAllBookings(env) {
  const result = await env.DB.prepare(`
    SELECT id, name, phone, address, type, area, extras, currency, amount, date, time, comment, status, created_at, updated_at
    FROM clearly_booking
    ORDER BY created_at DESC
    LIMIT 200
  `).all();
  return (result.results || []).map(normalizeBooking);
}

async function createBooking(env, userId, input) {
  const booking = parseBookingInput(input);
  if (!bookingDateIsFuture(booking.date, booking.time)) {
    throw Object.assign(new Error('INVALID_DATE'), { code: 'INVALID_DATE' });
  }

  const existing = await env.DB.prepare(`
    SELECT id, name, phone, address, type, area, extras, currency, amount, date, time, comment, status, created_at, updated_at
    FROM clearly_booking WHERE user_id = ? AND request_id = ? LIMIT 1
  `).bind(userId, booking.requestId).first();
  if (existing) return normalizeBooking(existing);

  const id = crypto.randomUUID();
  const now = Date.now();
  try {
    await env.DB.prepare(`
      INSERT INTO clearly_booking
        (id, request_id, user_id, name, phone, address, type, area, extras, currency, amount, date, time, comment, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)
    `).bind(
      id, booking.requestId, userId, booking.name, booking.phone, booking.address, booking.type, booking.area,
      JSON.stringify(booking.extras), booking.currency, booking.amount, booking.date, booking.time, booking.comment, now, now,
    ).run();
  } catch (error) {
    if (String(error?.message || '').toLowerCase().includes('unique')) {
      const row = await env.DB.prepare(`
        SELECT id, name, phone, address, type, area, extras, currency, amount, date, time, comment, status, created_at, updated_at
        FROM clearly_booking WHERE user_id = ? AND request_id = ? LIMIT 1
      `).bind(userId, booking.requestId).first();
      if (row) return normalizeBooking(row);
    }
    throw error;
  }

  const row = await env.DB.prepare(`
    SELECT id, name, phone, address, type, area, extras, currency, amount, date, time, comment, status, created_at, updated_at
    FROM clearly_booking WHERE id = ? LIMIT 1
  `).bind(id).first();
  return normalizeBooking(row);
}

async function handleApi(request, env, auth) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith('/api/auth/')) {
    if (!sameOrigin(request, env) && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return json({ error: 'BAD_ORIGIN' }, 403);
    return auth.handler(request);
  }

  if (path === '/api/me' && request.method === 'GET') {
    const session = await requireSession(auth, request);
    if (!session) return json({ error: 'UNAUTHORIZED' }, 401);
    return json({ user: session.user, session: session.session, admin: isAdmin(env, session.user.id) });
  }

  if (path === '/api/bookings' && request.method === 'GET') {
    const session = await requireSession(auth, request);
    if (!session) return json({ error: 'UNAUTHORIZED' }, 401);
    return json({ bookings: await listUserBookings(env, session.user.id) });
  }

  if (path === '/api/bookings' && request.method === 'POST') {
    if (!sameOrigin(request, env)) return json({ error: 'BAD_ORIGIN' }, 403);
    const session = await requireSession(auth, request);
    if (!session) return json({ error: 'UNAUTHORIZED' }, 401);
    try {
      const body = await request.json();
      const booking = await createBooking(env, session.user.id, body);
      return json({ booking }, 201);
    } catch (error) {
      return errorResponse(error, 400);
    }
  }

  if (path === '/api/admin/bookings' && request.method === 'GET') {
    const session = await requireSession(auth, request);
    if (!session) return json({ error: 'UNAUTHORIZED' }, 401);
    if (!isAdmin(env, session.user.id)) return json({ error: 'FORBIDDEN' }, 403);
    return json({ bookings: await listAllBookings(env) });
  }

  const statusMatch = path.match(/^\/api\/admin\/bookings\/([0-9a-f-]{20,80})$/i);
  if (statusMatch && request.method === 'PATCH') {
    if (!sameOrigin(request, env)) return json({ error: 'BAD_ORIGIN' }, 403);
    const session = await requireSession(auth, request);
    if (!session) return json({ error: 'UNAUTHORIZED' }, 401);
    if (!isAdmin(env, session.user.id)) return json({ error: 'FORBIDDEN' }, 403);
    let body;
    try { body = await request.json(); } catch { return json({ error: 'INVALID_BODY' }, 400); }
    if (!ALLOWED_STATUSES.has(body?.status)) return json({ error: 'INVALID_STATUS' }, 400);
    const result = await env.DB.prepare('UPDATE clearly_booking SET status = ?, updated_at = ? WHERE id = ?')
      .bind(body.status, Date.now(), statusMatch[1]).run();
    if (!result.meta?.changes) return json({ error: 'NOT_FOUND' }, 404);
    return json({ ok: true });
  }

  return json({ error: 'NOT_FOUND' }, 404);
}

export default {
  async fetch(request, env) {
    if (!env.DB || !env.BETTER_AUTH_SECRET) {
      if (new URL(request.url).pathname.startsWith('/api/')) return json({ error: 'SETUP_REQUIRED' }, 503);
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, buildAuth(env));
      } catch (error) {
        console.error('Clearly API error', error);
        return json({ error: 'SERVER_ERROR' }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};
