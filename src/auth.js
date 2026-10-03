import { betterAuth } from 'better-auth';

export function authOptions(env) {
  return {
    appName: 'Clearly',
    database: env.DB,
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.BETTER_AUTH_URL],
    emailAndPassword: { enabled: true, minPasswordLength: 12, maxPasswordLength: 128 },
    user: { modelName: 'clearly_user' },
    session: { modelName: 'clearly_session', expiresIn: 60 * 60 * 24 * 7 },
    account: { modelName: 'clearly_account' },
    verification: { modelName: 'clearly_verification' },
    advanced: { ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] } },
    rateLimit: {
      enabled: true, storage: 'database', modelName: 'clearly_rate_limit', window: 60, max: 100,
      customRules: { '/sign-in/email': { window: 60, max: 5 }, '/sign-up/email': { window: 60, max: 3 } },
    },
  };
}

export function createAuth(env) { return betterAuth(authOptions(env)); }
