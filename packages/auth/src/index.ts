import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import type { AppUser } from '@clayface/persistence';

export const passwordSchema = z.string()
  .min(10, 'Password must be at least 10 characters.')
  .max(128, 'Password is too long.')
  .regex(/[a-z]/, 'Password must include a lowercase letter.')
  .regex(/[A-Z]/, 'Password must include an uppercase letter.')
  .regex(/[0-9]/, 'Password must include a number.');
export const loginPasswordSchema = z.string().min(1).max(128);
export const emailSchema = z.string().trim().email();
export const nameSchema = z.string().trim().min(2).max(80);

export type AuthProviderIdentity = {
  provider: string;
  providerAccountId: string;
  emailVerified: boolean;
};

export type LegacyAccountRecord = {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string | null;
  authVersion?: number | null;
  disabledAt: Date | null;
  providers?: AuthProviderIdentity[];
};

export type PreservedAccount = {
  user: AppUser;
  providers: AuthProviderIdentity[];
};

export type SessionClaims = {
  userId: string;
  authVersion: number;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function parseCredentials(input: unknown) {
  return z.object({ email: emailSchema, password: loginPasswordSchema }).safeParse(input);
}

export function getSafeCallbackPath(callbackUrl: string | null | undefined, fallback = '/workspace') {
  if (!callbackUrl || !callbackUrl.startsWith('/') || callbackUrl.startsWith('//')) return fallback;
  return callbackUrl;
}

export function getRequestIp(headers: Headers) {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown';
  return headers.get('x-real-ip') || 'unknown';
}

export function isSessionCurrent(user: Pick<AppUser, 'id' | 'authVersion' | 'disabledAt'>, claims: SessionClaims) {
  return user.id === claims.userId && user.authVersion === claims.authVersion && user.disabledAt === null;
}

export function createSessionClaims(user: Pick<AppUser, 'id' | 'authVersion' | 'disabledAt'>): SessionClaims | null {
  if (user.disabledAt) return null;
  return { userId: user.id, authVersion: user.authVersion };
}

export function preserveLegacyAccount(record: LegacyAccountRecord): PreservedAccount {
  const email = normalizeEmail(emailSchema.parse(record.email));
  const providers = (record.providers ?? []).filter(provider => provider.provider.trim() && provider.providerAccountId.trim());
  return {
    user: {
      id: record.id,
      legacyUserId: record.id,
      email,
      name: record.name?.trim() || null,
      passwordHash: record.passwordHash,
      authVersion: Number.isInteger(record.authVersion) && (record.authVersion ?? 0) >= 0 ? record.authVersion ?? 0 : 0,
      disabledAt: record.disabledAt,
    },
    providers,
  };
}

export function createPasswordResetToken() {
  const rawToken = randomBytes(32).toString('hex');
  return { rawToken, tokenHash: hashPasswordResetToken(rawToken) };
}

export function hashPasswordResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
