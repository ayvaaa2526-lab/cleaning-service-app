// Runs against local D1 only. Never connects to the production database.
import assert from 'node:assert/strict';
import { getPlatformProxy } from 'wrangler';
import worker from '../src/worker.js';

const proxy = await getPlatformProxy({ persist: { path: '.wrangler/state/v3' } });
const env = { ...proxy.env, BETTER_AUTH_URL:'http://localhost:8787', BETTER_AUTH_SECRET:crypto.randomUUID()+crypto.randomUUID(), ADMIN_USER_IDS:'' };
const userIds=[];
const auth = new Map();
async function call(path, { user='a', method='GET', body, origin='http://localhost:8787' }={}) {
  const headers={ 'Content-Type':'application/json', 'Origin':origin, 'cf-connecting-ip':user==='a'?'192.0.2.21':'192.0.2.22' };
  if(auth.has(user)) headers.Cookie=auth.get(user);
  const request=new Request(env.BETTER_AUTH_URL+path,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})});
  const response=await worker.fetch(request,env);
  if(response.headers.getSetCookie().length)auth.set(user,response.headers.getSetCookie().map(c=>c.split(';')[0]).join('; '));
  return { status:response.status, body:await response.json(), headers:response.headers };
}
try {
  assert.equal((await call('/api/bookings')).status,401);
  const accounts={};
  for(const user of ['a','b']) {
    accounts[user]={email:`clearly-test-${crypto.randomUUID()}@example.com`,password:crypto.randomUUID()+'!secure'};
    const signup=await call('/api/auth/sign-up/email',{user,method:'POST',body:{...accounts[user],name:'Test '+user}});
    assert.equal(signup.status,200,JSON.stringify(signup.body));
    userIds.push(signup.body.user.id);
    assert.ok(auth.get(user));
    const me=await call('/api/me',{user}); assert.equal(me.status,200);assert.equal(me.body.admin,false);
  }
  const input={requestId:crypto.randomUUID(),type:'deep',area:60,extras:['oven'],currency:'USD',amount:1,name:'<img src=x onerror=alert(1)>',phone:'+995555000000',address:'Test address',date:'2099-12-20',time:'12:00',comment:'Must persist'};
  assert.equal((await call('/api/bookings',{method:'POST',body:input,origin:'https://evil.example'})).status,403);
  const saved=await call('/api/bookings',{method:'POST',body:input}); assert.equal(saved.status,201,JSON.stringify(saved.body));
  assert.equal(saved.body.booking.amount,96);assert.equal(saved.body.booking.comment,'Must persist');
  const retry=await call('/api/bookings',{method:'POST',body:input});assert.equal(retry.body.booking.id,saved.body.booking.id);
  assert.equal((await call('/api/bookings')).body.bookings.length,1);
  assert.equal((await call('/api/bookings',{user:'b'})).body.bookings.length,0);
  assert.equal((await call('/api/admin/bookings',{user:'b'})).status,403);
  assert.equal((await call('/api/admin/bookings/'+saved.body.booking.id,{user:'b',method:'PATCH',body:{status:'completed'}})).status,403);
  env.ADMIN_USER_IDS=userIds[0];
  assert.equal((await call('/api/admin/bookings/'+saved.body.booking.id,{method:'PATCH',body:{status:'confirmed'}})).status,200);
  assert.equal((await call('/api/bookings')).body.bookings[0].status,'confirmed');
  const oldCookie=auth.get('a');
  assert.equal((await call('/api/auth/sign-out',{method:'POST',body:{}})).status,200);
  auth.set('a',oldCookie);assert.equal((await call('/api/bookings')).status,401);
  auth.delete('a');
  const signin=await call('/api/auth/sign-in/email',{method:'POST',body:accounts.a});assert.equal(signin.status,200,JSON.stringify(signin.body));
  assert.equal((await call('/api/bookings')).body.bookings.length,1);
  assert.equal((await call('/api/bookings',{method:'POST',body:{...input,requestId:crypto.randomUUID(),area:-1}})).status,400);
  console.log('PASS: register, sign in, session revocation, server pricing, comment storage, deduplication, CSRF, account isolation and admin permissions on local D1.');
} finally {
  for(const id of userIds) await env.DB.prepare('DELETE FROM clearly_user WHERE id = ?').bind(id).run();
  await env.DB.prepare('DELETE FROM clearly_rate_limit').run();
  await proxy.dispose();
}
