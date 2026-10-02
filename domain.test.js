import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingDateIsFuture, calculateAmount, parseAdminIds, parseBookingInput } from '../src/domain.js';

test('calculates GEL maintenance price', () => {
  assert.equal(calculateAmount({ type: 'daily', area: 60, extras: [], currency: 'GEL' }), 120);
});

test('calculates extras once even when duplicated', () => {
  assert.equal(calculateAmount({ type: 'deep', area: 50, extras: ['windows', 'windows', 'oven'], currency: 'GEL' }), 245);
});

test('calculates USD with two decimals', () => {
  assert.equal(calculateAmount({ type: 'daily', area: 60, extras: [], currency: 'USD' }), 44.44);
});

test('rejects invalid area', () => {
  assert.throws(() => calculateAmount({ type: 'daily', area: 2, extras: [], currency: 'GEL' }), /INVALID_AREA/);
});

test('parses booking fields and strips surrounding whitespace', () => {
  const result = parseBookingInput({ requestId: '12345678-1234-1234-1234-123456789abc', type: 'deep', area: 70, extras: ['oven'], currency: 'GEL', name: '  Vali  ', phone: ' 555 ', address: ' Tbilisi ', date: '2030-01-01', time: '12:30', comment: ' hi ' });
  assert.equal(result.name, 'Vali');
  assert.equal(result.amount, 300);
});

test('validates future Tbilisi date', () => {
  assert.equal(bookingDateIsFuture('2030-01-01', '12:00', Date.parse('2029-12-31T20:00:00Z')), true);
  assert.equal(bookingDateIsFuture('2020-01-01', '12:00', Date.parse('2029-12-31T20:00:00Z')), false);
});

test('parses comma separated admin IDs', () => {
  assert.deepEqual([...parseAdminIds(' a, b ,,c ')], ['a', 'b', 'c']);
});
