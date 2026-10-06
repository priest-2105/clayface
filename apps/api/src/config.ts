import { z } from 'zod';

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const config = z.object({
    DATABASE_URL: z.string().url(), APP_ORIGIN: z.string().url().default('http://127.0.0.1:3000'),
    AUTH_ENCRYPTION_KEY: z.string().regex(/^[0-9a-f]{64}$/i, 'Set AUTH_ENCRYPTION_KEY to 32 random bytes encoded as hex.'),
    MAIL_MODE: z.enum(['local', 'smtp']).default('local'), SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().default(587), SMTP_USER: z.string().optional(), SMTP_PASSWORD: z.string().optional(),
    MAIL_FROM: z.string().default('Clayface <no-reply@example.com>'), NODE_ENV: z.string().optional(),
  }).parse(env);
  if (config.NODE_ENV === 'production' && (config.MAIL_MODE !== 'smtp' || !config.APP_ORIGIN.startsWith('https://'))) throw new Error('Production requires HTTPS and SMTP email delivery.');
  if (config.MAIL_MODE === 'smtp' && !config.SMTP_HOST) throw new Error('SMTP_HOST is required for email delivery.');
  return config;
}
export type Config = ReturnType<typeof loadConfig>;

export function isTrustedOrigin(origin: string | undefined, config: Config): boolean {
  if (!origin) return false;
  if (origin === config.APP_ORIGIN) return true;
  if (config.NODE_ENV === 'production') return false;
  try {
    const supplied = new URL(origin), configured = new URL(config.APP_ORIGIN);
    const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
    return supplied.origin === origin && supplied.protocol === 'http:' && configured.protocol === 'http:'
      && loopback.has(supplied.hostname) && loopback.has(configured.hostname) && supplied.port === configured.port;
  } catch { return false; }
}
