import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const cwd = process.cwd();
const persist = await mkdtemp(join(tmpdir(), 'clearly-d1-'));
const baseURL = 'http://127.0.0.1:8791';
const secret = 'clearly-local-integration-secret-0123456789abcdef';

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32', ...options });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

function cookieJar() {
  const jar = new Map();
  return {
    header() { return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; '); },
    absorb(headers) {
      const values = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [headers.get('set-cookie')].filter(Boolean);
      for (const value of values) {
        const first = value.split(';', 1)[0];
        const i = first.indexOf('=');
        if (i > 0) jar.set(first.slice(0, i), first.slice(i + 1));
      }
    },
  };
}

async function request(path, { method = 'GET', body, jar } = {}) {
  const headers = { origin: baseURL };
  if (body !== undefined) headers['content-type'] = 'application/json';
  const cookie = jar?.header();
  if (cookie) headers.cookie = cookie;
  const response = await fetch(baseURL + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
  jar?.absorb(response.headers);
  const data = await response.json().catch(() => null);
  return { response, data };
}

let server;
try {
  await run('npx', ['wrangler', 'd1', 'migrations', 'apply', 'DB', '--local', '--persist-to', persist]);
  server = spawn('npx', [
    'wrangler', 'dev', '--local', '--port', '8791', '--persist-to', persist,
    '--var', `BETTER_AUTH_URL:${baseURL}`,
    '--var', `BETTER_AUTH_SECRET:${secret}`,
  ], { cwd, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' });

  let ready = false;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await fetch(baseURL + '/api/me');
      if ([401, 503].includes(res.status)) { ready = true; break; }
    } catch {}
  }
  assert.equal(ready, true, 'wrangler dev did not become ready');

  const first = cookieJar();
  const email1 = `clearly-${crypto.randomUUID()}@example.test`;
  let out = await request('/api/auth/sign-up/email', {
    method: 'POST', jar: first,
    body: { name: 'First Test', email: email1, password: 'IntegrationPass123!' },
  });
  assert.equal(out.response.ok, true, JSON.stringify(out.data));

  out = await request('/api/me', { jar: first });
  assert.equal(out.response.status, 200);
  assert.equal(out.data.user.email, email1);
  assert.equal(out.data.admin, false);

  const requestId = crypto.randomUUID();
  const booking = {
    requestId, type: 'deep', area: 70, extras: ['oven'], currency: 'GEL',
    name: 'Integration User', phone: '+995555000000', address: 'Tbilisi',
    date: '2030-01-01', time: '12:30', comment: 'integration',
  };
  const created = await request('/api/bookings', { method: 'POST', jar: first, body: booking });
  assert.equal(created.response.status, 201, JSON.stringify(created.data));
  assert.equal(created.data.booking.amount, 300);

  const duplicate = await request('/api/bookings', { method: 'POST', jar: first, body: booking });
  assert.equal(duplicate.response.status, 201);
  assert.equal(duplicate.data.booking.id, created.data.booking.id);

  out = await request('/api/bookings', { jar: first });
  assert.equal(out.response.status, 200);
  assert.equal(out.data.bookings.some((b) => b.id === created.data.booking.id), true);

  out = await request('/api/admin/bookings', { jar: first });
  assert.equal(out.response.status, 403);

  const second = cookieJar();
  const email2 = `clearly-${crypto.randomUUID()}@example.test`;
  out = await request('/api/auth/sign-up/email', {
    method: 'POST', jar: second,
    body: { name: 'Second Test', email: email2, password: 'IntegrationPass123!' },
  });
  assert.equal(out.response.ok, true, JSON.stringify(out.data));
  out = await request('/api/bookings', { jar: second });
  assert.equal(out.response.status, 200);
  assert.equal(out.data.bookings.length, 0);

  out = await request('/api/auth/sign-out', { method: 'POST', jar: first, body: {} });
  assert.equal(out.response.ok, true, JSON.stringify(out.data));
  out = await request('/api/me', { jar: first });
  assert.equal(out.response.status, 401);

  console.log('Clearly integration smoke test passed.');
} finally {
  if (server) server.kill('SIGTERM');
  await rm(persist, { recursive: true, force: true });
}
