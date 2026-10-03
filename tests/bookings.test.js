import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateBooking } from '../src/bookings.js';
const now = new Date('2026-09-26T12:00:00Z');
const valid = { requestId:'c27a9609-7338-40e2-bf02-686ae40745b3', type:'deep', area:60, extras:['oven'], currency:'GEL', name:'Test', phone:'+995555000000', address:'Test address', date:'2026-09-27', time:'12:00', comment:'Test note' };
test('server ignores caller prices and calculates GEL/USD', () => {
  assert.equal(validateBooking({...valid, amount:1, totalGel:1},now).amount,260);
  assert.equal(validateBooking({...valid,currency:'USD'},now).amount,96);
});
test('rejects tampered services, duplicates, oversized fields and non-finite area', () => {
  for(const changes of [{type:'__proto__'},{extras:['constructor']},{extras:['oven','oven']},{area:NaN},{area:21},{area:9999},{currency:'EUR'},{comment:'x'.repeat(2001)},{name:[]},{requestId:'bad'}])
    assert.throws(()=>validateBooking({...valid,...changes},now));
});
test('validates actual calendar dates and Tbilisi time', () => {
  for(const changes of [{date:'2026-02-30'},{date:'2026-09-25'},{time:'25:00'},{date:'2026-09-26',time:'15:59'}])
    assert.throws(()=>validateBooking({...valid,...changes},now),/INVALID_DATE/);
  assert.equal(validateBooking({...valid,date:'2026-09-26',time:'16:01'},now).time,'16:01');
});
