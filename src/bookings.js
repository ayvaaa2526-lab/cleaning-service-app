export const RATES = { daily: 2, deep: 4, reno: 5 };
export const EXTRAS = { windows: 25, oven: 20, fridge: 20, balcony: 30 };
export const STATUSES = ['new', 'confirmed', 'completed', 'cancelled'];

export function validateBooking(body, now = new Date()) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('INVALID_BOOKING');
  const { type, area, currency, extras, date, time, requestId } = body;
  if (!Object.hasOwn(RATES, type) || !Number.isInteger(area) || area < 20 || area > 300 || area % 5 !== 0)
    throw new Error('INVALID_BOOKING');
  if (!['GEL', 'USD'].includes(currency) || !Array.isArray(extras) || extras.length > 4 ||
      new Set(extras).size !== extras.length || extras.some(k => !Object.hasOwn(EXTRAS, k)))
    throw new Error('INVALID_BOOKING');
  if (typeof requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(requestId)) throw new Error('INVALID_BOOKING');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tbilisi' }).format(now);
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date < today ||
      typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
      Date.parse(`${date}T${time}:00+04:00`) <= now.getTime()) throw new Error('INVALID_DATE');
  const clean = {};
  for (const [key, min, max] of [['name', 1, 100], ['phone', 5, 40], ['address', 3, 500], ['comment', 0, 2000]]) {
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.trim().length < min || value.length > max) throw new Error('INVALID_BOOKING');
    clean[key] = value.trim();
  }
  // Prices are always calculated on the server, never accepted from the browser.
  const totalGel = area * RATES[type] + extras.reduce((sum, key) => sum + EXTRAS[key], 0);
  return { ...clean, type, area, currency, extras, date, time, requestId, totalGel,
    amount: Math.round(totalGel / (currency === 'USD' ? 2.7 : 1)) };
}
