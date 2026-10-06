import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { compare, hash } from 'bcryptjs';
import { TOTP, Secret } from 'otpauth';
import type { Transaction } from './database';

export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export const token = () => randomBytes(32).toString('hex');
export const hashPassword = (password: string) => hash(password, 12);
export const verifyPassword = (password: string, stored: string | null) => stored ? compare(password, stored) : Promise.resolve(false);
export function encrypt(value: string, key: string) {
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  return Buffer.concat([iv, cipher.update(value, 'utf8'), cipher.final(), cipher.getAuthTag()]).toString('base64');
}
export function decrypt(value: string, key: string) {
  const bytes = Buffer.from(value, 'base64'), decipher = createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), bytes.subarray(0, 12));
  decipher.setAuthTag(bytes.subarray(-16));
  return Buffer.concat([decipher.update(bytes.subarray(12, -16)), decipher.final()]).toString('utf8');
}
export function authenticator(secret: string, email: string) { return new TOTP({ issuer: 'Clayface', label: email, algorithm: 'SHA1', digits: 6, period: 30, secret: Secret.fromBase32(secret) }); }
export const newSecret = () => new Secret({ size: 20 }).base32;
export const newRecoveryCodes = () => Array.from({ length: 8 }, () => randomBytes(10).toString('hex'));
export class HttpError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}
export async function consumeFactor(tx: Transaction, user: { id: string; email: string; totp_secret: string | null; totp_last_step: string }, code: string, key: string) {
  if (!user.totp_secret) throw new HttpError(400, 'Two-factor authentication is not enabled.');
  if (/^\d{6}$/.test(code)) {
    const delta = authenticator(decrypt(user.totp_secret, key), user.email).validate({ token: code, window: 1 });
    const step = Math.floor(Date.now() / 30000) + (delta ?? 0);
    if (delta !== null && step > Number(user.totp_last_step)) {
      await tx.query('UPDATE app_user SET totp_last_step=$2 WHERE id=$1', [user.id, step]); return;
    }
  } else {
    const used = await tx.query('DELETE FROM recovery_code WHERE user_id=$1 AND code_hash=$2 RETURNING code_hash', [user.id, digest(code.trim().toLowerCase())]);
    if (used.rowCount) return;
  }
  throw new HttpError(400, 'That code is invalid or has already been used. Try a fresh code or a recovery code.');
}
