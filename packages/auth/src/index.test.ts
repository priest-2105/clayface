import { describe, expect, it } from 'vitest';
import {
  createPasswordResetToken,
  createSessionClaims,
  getSafeCallbackPath,
  hashPasswordResetToken,
  isSessionCurrent,
  normalizeEmail,
  passwordSchema,
  parseCredentials,
  preserveLegacyAccount,
} from './index';

const user = {
  id: 'legacy-user-1',
  legacyUserId: 'legacy-user-1',
  email: 'person@example.com',
  name: 'Person',
  passwordHash: '$2b$12$preserved',
  authVersion: 4,
  disabledAt: null,
};

describe('auth foundation', () => {
  it('normalizes credentials without accepting malformed login input', () => {
    expect(normalizeEmail('  Person@Example.COM ')).toBe('person@example.com');
    expect(parseCredentials({ email: 'person@example.com', password: 'short' }).success).toBe(true);
    expect(parseCredentials({ email: 'not-an-email', password: '' }).success).toBe(false);
  });

  it('keeps the registration password policy separate from login parsing', () => {
    expect(passwordSchema.safeParse('long enough but no number or uppercase').success).toBe(false);
    expect(passwordSchema.safeParse('Long enough 9').success).toBe(true);
  });

  it('invalidates sessions when auth version changes or an account is disabled', () => {
    const claims = createSessionClaims(user);
    expect(claims && isSessionCurrent(user, claims)).toBe(true);
    expect(isSessionCurrent({ ...user, authVersion: 5 }, claims!)).toBe(false);
    expect(createSessionClaims({ ...user, disabledAt: new Date() })).toBeNull();
  });

  it('preserves legacy identity, hash and provider references', () => {
    const preserved = preserveLegacyAccount({ ...user, email: ' Person@Example.COM ', providers: [{ provider: 'google', providerAccountId: 'google-1', emailVerified: true }] });
    expect(preserved.user).toMatchObject({ id: user.id, legacyUserId: user.id, email: user.email, passwordHash: user.passwordHash, authVersion: 4 });
    expect(preserved.providers[0]).toMatchObject({ provider: 'google', providerAccountId: 'google-1' });
  });

  it('does not allow open redirects and hashes reset tokens', () => {
    expect(getSafeCallbackPath('https://evil.example')).toBe('/workspace');
    expect(getSafeCallbackPath('//evil.example')).toBe('/workspace');
    expect(getSafeCallbackPath('/settings')).toBe('/settings');
    const token = createPasswordResetToken();
    expect(token.rawToken).not.toBe(token.tokenHash);
    expect(hashPasswordResetToken(token.rawToken)).toBe(token.tokenHash);
  });
});
