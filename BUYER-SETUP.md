# Clearly 4.1 — buyer handoff

Source-code project for cleaning estimates and booking requests. Asking price: USD 300. No revenue, customer base or traffic is represented or included in this package. Sale scope and rights must be agreed separately; third-party dependencies retain their own licenses.

## Included
Russian, English and Georgian UI; GEL/USD estimates; three cleaning types and four extras; email/password accounts; customer booking history; administrator status management; printable quote; administrator CSV export. Language/currency preferences stay on the device. Bookings are stored server-side in Cloudflare D1.

## Local setup
Use Node.js 24 and npm. Run `npm ci`. Create `.dev.vars` with BETTER_AUTH_URL="http://localhost:8787" and a random BETTER_AUTH_SECRET of at least 32 characters. Never commit this file. Run `npm run db:local`, then `npm run dev`.

## Deploy into your own account
1. Create your own Cloudflare Worker and D1 database.
2. Replace the Worker name, database name/ID and BETTER_AUTH_URL in wrangler.jsonc. The included settings point to the original owner's installation: do not deploy unchanged.
3. Authenticate Wrangler to YOUR account, then apply migrations with `npm run db:remote` to the new empty database.
4. Set BETTER_AUTH_SECRET as a Worker secret (`npx wrangler secret put BETTER_AUTH_SECRET`).
5. Run `npm run deploy`. Register an account; obtain its ID from clearly_user and set ADMIN_USER_IDS to that ID. Redeploy.
6. Check registration, sign-in, a booking, persistence after reload, a second account's isolation, admin status changes and CSV export on the actual deployment.

No owner credentials, secrets, real bookings, domain or hosting account are included. Hosting and future running costs are the buyer's responsibility.

## Pricing customization
Edit RATES and EXTRAS in src/bookings.js AND matching types/extras in app.js together, then test and deploy. The fixed illustrative conversion rate is 2.7 GEL/USD and must also match in both files. Rates currently cannot be edited from the dashboard.

## Limits
Email verification/recovery, payments, booking notifications, calendar availability and conflict prevention are not implemented. A request is not a confirmed appointment. Lists and CSV contain only the latest 200 bookings. Quotes are estimates. Local browser QA passed; production readiness has not been verified.

## Validation on October 2, 2026
Unit/DOM tests and Worker dry-run build passed. Local D1 integration passed registration, login/logout, server pricing, comments, retry deduplication, CSRF, account isolation and admin access. Local wrangler dev starts successfully. Chromium checks passed registration, sign-in/out, booking persistence, anonymous isolation and mobile RU/EN/KA layouts. Production checks remain required. USD unit rates show two decimals, and a pending CSV export is discarded if the administrator signs out.
