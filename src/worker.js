import { createAuth } from './auth.js';
import { validateBooking, STATUSES } from './bookings.js';

const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const error = (code, status) => json({ error: code }, status);
const isAdmin = (env, id) => (env.ADMIN_USER_IDS || '').split(',').map(x => x.trim()).filter(Boolean).includes(id);

async function readBody(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('INVALID_BOOKING');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('INVALID_BOOKING');
  const chunks = []; let length = 0;
  while (true) {
    const { value, done } = await reader.read(); if (done) break;
    length += value.byteLength;
    if (length > 16384) { await reader.cancel(); throw new Error('BODY_TOO_LARGE'); }
    chunks.push(value);
  }
  const all = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(all)); } catch { throw new Error('INVALID_BOOKING'); }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!env.DB || !env.BETTER_AUTH_URL || !env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32)
      return error('SETUP_REQUIRED', 503);
    if (!['GET', 'HEAD'].includes(request.method) && request.headers.get('origin') !== new URL(env.BETTER_AUTH_URL).origin)
      return error('FORBIDDEN', 403);
    try {
      const auth = createAuth(env);
      if (url.pathname.startsWith('/api/auth/')) {
        // Bound incoming auth payloads before handing them to the auth library.
        if (request.method === 'POST') {
          const body = await readBody(request);
          request = new Request(request, { body: JSON.stringify(body) });
        }
        const response = await auth.handler(request);
        const secured = new Response(response.body, response);
        secured.headers.set('Cache-Control', 'no-store');
        return secured;
      }
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) return error('UNAUTHORIZED', 401);
      const userId = session.user.id;
      if (url.pathname === '/api/me' && request.method === 'GET')
        return json({ user: { id: userId, name: session.user.name, email: session.user.email }, admin: isAdmin(env, userId) });
      if (url.pathname === '/api/bookings' && request.method === 'GET') {
        const result = await env.DB.prepare('SELECT * FROM clearly_booking WHERE user_id = ? ORDER BY created_at DESC LIMIT 200').bind(userId).all();
        return json({ bookings: result.results });
      }
      if (url.pathname === '/api/bookings' && request.method === 'POST') {
        const b = validateBooking(await readBody(request));
        const id = crypto.randomUUID();
        await env.DB.prepare(`INSERT INTO clearly_booking
          (id, user_id, request_id, type, area, extras, currency, amount, total_gel, name, phone, address, date, time, comment, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
          ON CONFLICT(user_id, request_id) DO NOTHING`)
          .bind(id, userId, b.requestId, b.type, b.area, JSON.stringify(b.extras), b.currency, b.amount, b.totalGel,
            b.name, b.phone, b.address, b.date, b.time, b.comment, Date.now()).run();
        const booking = await env.DB.prepare('SELECT * FROM clearly_booking WHERE user_id = ? AND request_id = ?').bind(userId, b.requestId).first();
        return json({ booking }, 201);
      }
      if (url.pathname.startsWith('/api/admin/')) {
        if (!isAdmin(env, userId)) return error('FORBIDDEN', 403);
        if (url.pathname === '/api/admin/bookings' && request.method === 'GET') {
          const result = await env.DB.prepare('SELECT * FROM clearly_booking ORDER BY created_at DESC LIMIT 200').all();
          return json({ bookings: result.results });
        }
        const match = url.pathname.match(/^\/api\/admin\/bookings\/([0-9a-f-]{36})$/i);
        if (match && request.method === 'PATCH') {
          const body = await readBody(request);
          if (!STATUSES.includes(body.status)) return error('INVALID_BOOKING', 400);
          const result = await env.DB.prepare('UPDATE clearly_booking SET status = ? WHERE id = ?').bind(body.status, match[1]).run();
          return result.meta.changes ? json({ success: true }) : error('NOT_FOUND', 404);
        }
      }
      return error('NOT_FOUND', 404);
    } catch (cause) {
      if (['INVALID_BOOKING', 'INVALID_DATE', 'BODY_TOO_LARGE'].includes(cause.message))
        return error(cause.message, cause.message === 'BODY_TOO_LARGE' ? 413 : 400);
      // Never include passwords, request bodies or personal booking details in logs.
      console.error('Clearly API failed', { name: cause.name });
      return error('SERVER_ERROR', 500);
    }
  },
};
