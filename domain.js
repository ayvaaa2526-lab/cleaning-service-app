export const CLEANING_RATES_GEL = Object.freeze({ daily: 2, deep: 4, reno: 5 });
export const EXTRA_RATES_GEL = Object.freeze({ windows: 25, oven: 20, fridge: 20, balcony: 30 });
export const ALLOWED_STATUSES = new Set(['new', 'confirmed', 'completed', 'cancelled']);
export const USD_RATE = 2.7;

export function calculateAmount({ type, area, extras = [], currency = 'GEL' }) {
  if (!Object.hasOwn(CLEANING_RATES_GEL, type)) throw Object.assign(new Error('INVALID_TYPE'), { code: 'INVALID_TYPE' });
  const numericArea = Number(area);
  if (!Number.isFinite(numericArea) || numericArea < 10 || numericArea > 300) {
    throw Object.assign(new Error('INVALID_AREA'), { code: 'INVALID_AREA' });
  }
  if (!Array.isArray(extras) || extras.some((key) => !Object.hasOwn(EXTRA_RATES_GEL, key))) {
    throw Object.assign(new Error('INVALID_EXTRAS'), { code: 'INVALID_EXTRAS' });
  }
  if (!['GEL', 'USD'].includes(currency)) throw Object.assign(new Error('INVALID_CURRENCY'), { code: 'INVALID_CURRENCY' });

  const uniqueExtras = [...new Set(extras)];
  const gel = numericArea * CLEANING_RATES_GEL[type] + uniqueExtras.reduce((sum, key) => sum + EXTRA_RATES_GEL[key], 0);
  return currency === 'USD' ? Number((gel / USD_RATE).toFixed(2)) : Number(gel.toFixed(2));
}

export function parseBookingInput(input) {
  if (!input || typeof input !== 'object') throw Object.assign(new Error('INVALID_BODY'), { code: 'INVALID_BODY' });
  const text = (key, max) => String(input[key] ?? '').trim().slice(0, max);
  const booking = {
    requestId: text('requestId', 80),
    type: text('type', 20),
    area: Number(input.area),
    extras: Array.isArray(input.extras) ? [...new Set(input.extras.map(String))] : [],
    currency: text('currency', 3),
    name: text('name', 120),
    phone: text('phone', 60),
    address: text('address', 240),
    date: text('date', 10),
    time: text('time', 5),
    comment: text('comment', 1000),
  };
  if (!/^[0-9a-f-]{20,80}$/i.test(booking.requestId)) throw Object.assign(new Error('INVALID_REQUEST_ID'), { code: 'INVALID_REQUEST_ID' });
  if (!booking.name || !booking.phone || !booking.address) throw Object.assign(new Error('MISSING_FIELDS'), { code: 'MISSING_FIELDS' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.date) || !/^\d{2}:\d{2}$/.test(booking.time)) {
    throw Object.assign(new Error('INVALID_DATE'), { code: 'INVALID_DATE' });
  }
  booking.amount = calculateAmount(booking);
  return booking;
}

export function bookingDateIsFuture(date, time, nowMs = Date.now()) {
  const ts = Date.parse(`${date}T${time}:00+04:00`);
  return Number.isFinite(ts) && ts > nowMs;
}

export function parseAdminIds(value) {
  return new Set(String(value ?? '').split(',').map((id) => id.trim()).filter(Boolean));
}
