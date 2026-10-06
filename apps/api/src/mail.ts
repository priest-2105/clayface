import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import type { Config } from './config';
export function createMailer(config: Config) {
  const transport = config.MAIL_MODE === 'smtp' ? nodemailer.createTransport({ host: config.SMTP_HOST, port: config.SMTP_PORT, secure: config.SMTP_PORT === 465, auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASSWORD } : undefined }) : null;
  return async (to: string, resetToken: string) => {
    const link = `${config.APP_ORIGIN}/reset-password?token=${resetToken}`;
    const message = { from: config.MAIL_FROM, to, subject: 'Reset your Clayface password', text: `Open this link to choose a new password. It expires in 30 minutes and can only be used once.\n\n${link}\n\nIf you did not request this, you can ignore this email.` };
    if (transport) { await transport.sendMail(message); return; }
    const directory = new URL('../../../.local-mail/', import.meta.url);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL(`${Date.now()}-${randomUUID()}.json`, directory), JSON.stringify(message, null, 2), { mode: 0o600 });
  };
}
