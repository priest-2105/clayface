import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Pool, type Database } from './database';
import { createServer } from './server';
import { isTrustedOrigin, loadConfig } from './config';
import { authenticator } from './security';
import type { FastifyInstance } from 'fastify';
import type { Project } from '@clayface/schema';

const schema = `clayface_test_${randomBytes(8).toString('hex')}`;
let admin: Database, db: Database, app: FastifyInstance;
const emails: { to: string; token: string }[] = [];
const password = 'A dependable password 42';
const origin = 'http://127.0.0.1:3000';
const headers = (cookie = '') => ({ origin, 'x-clayface-request': '1', cookie });
const cookieOf = (response: { cookies: { name: string; value: string }[] }) => response.cookies.map(c => `${c.name}=${c.value}`).join('; ');
let primaryCookie = '', primaryEmail = '', project: Record<string, unknown>;
let schemaCreated = false;

beforeAll(async () => {
  const config = loadConfig(); const url = new URL(config.DATABASE_URL);
  if (!['localhost','127.0.0.1'].includes(url.hostname) || !['/clayface_dev','/clayface_test'].includes(url.pathname)) throw new Error('Integration tests require a local Clayface development database.');
  admin = new Pool({ connectionString: config.DATABASE_URL });
  await admin.query(`CREATE SCHEMA ${schema}`);
  schemaCreated = true;
  db = new Pool({ connectionString: config.DATABASE_URL, options: `-c search_path=${schema},public` });
  for (const name of ['0001_server_foundation.sql','0002_accounts_onboarding.sql']) await db.query(await readFile(new URL(`../../../packages/persistence/migrations/${name}`, import.meta.url), 'utf8'));
  app = await createServer(db, config, async (to, value) => { emails.push({ to, token: value }); });
});
afterAll(async () => {
  await app?.close(); await db?.end();
  if (admin) { try { if (schemaCreated) await admin.query(`DROP SCHEMA ${schema} CASCADE`); } finally { await admin.end(); } }
});

describe('PostgreSQL account and onboarding flow', () => {
  it('accepts local hostname aliases without allowing arbitrary cross-origin mutations', async () => {
    const config = loadConfig();
    for (const origin of ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://[::1]:3000']) {
      expect(isTrustedOrigin(origin, config)).toBe(true);
      expect((await app.inject({ method: 'POST', url: '/api/auth/signout', headers: { ...headers(), origin }, payload: {} })).statusCode).toBe(200);
    }
    for (const origin of ['null', 'http://localhost:3001', 'http://localhost.evil.test:3000', 'https://another.example']) {
      expect((await app.inject({ method: 'POST', url: '/api/auth/signout', headers: { ...headers(), origin }, payload: {} })).statusCode).toBe(403);
    }
    expect((await app.inject({ method: 'POST', url: '/api/auth/signout', headers: { origin }, payload: {} })).statusCode).toBe(403);
    expect((await app.inject({ method: 'POST', url: '/api/auth/signout', payload: {} })).statusCode).toBe(403);
    expect(isTrustedOrigin('http://localhost:3000', { ...config, NODE_ENV: 'production' })).toBe(false);
  });
  it('enforces signup → name → project → design and durable saves', async () => {
    primaryEmail = 'first@example.test';
    const signup = await app.inject({ method: 'POST', url: '/api/auth/signup', headers: headers(), payload: { email: primaryEmail, password } });
    expect(signup.statusCode, signup.body).toBe(200); primaryCookie = cookieOf(signup);
    expect(signup.json().user.onboardingStep).toBe('name');
    const early = await app.inject({ method: 'POST', url: '/api/onboarding/design', headers: headers(primaryCookie), payload: { strategy: 'product' } });
    expect(early.statusCode).toBe(409);
    const name = await app.inject({ method: 'POST', url: '/api/onboarding/name', headers: headers(primaryCookie), payload: { name: 'Alex' } });
    expect(name.json().user.onboardingStep).toBe('project');
    const details = await app.inject({ method: 'POST', url: '/api/onboarding/project', headers: headers(primaryCookie), payload: { name: 'Northstar', productType: 'Software / SaaS', brief: 'A calm planning tool for small teams.', pages: ['Home','Features','Contact'] } });
    expect(details.statusCode, details.body).toBe(200); expect(details.json().user.onboardingStep).toBe('design');
    const design = await app.inject({ method: 'POST', url: '/api/onboarding/design', headers: headers(primaryCookie), payload: { strategy: 'product' } });
    expect(design.statusCode, design.body).toBe(200); expect(design.json().user.onboardingStep).toBe('complete');
    project = design.json().project;
    const duplicate = await app.inject({ method: 'POST', url: '/api/onboarding/design', headers: headers(primaryCookie), payload: { strategy: 'product' } });
    expect(duplicate.json().project.id).toBe(project.id);
    const save = await app.inject({ method: 'PUT', url: '/api/project', headers: headers(primaryCookie), payload: { project, version: 1 } });
    expect(save.statusCode, save.body).toBe(200); expect(save.json().version).toBe(2);
    const stale = await app.inject({ method: 'PUT', url: '/api/project', headers: headers(primaryCookie), payload: { project, version: 1 } });
    expect(stale.statusCode).toBe(409);
    const stored = await app.inject({ method: 'GET', url: '/api/project', headers: headers(primaryCookie) });
    expect(stored.json().project.workspace_document).toEqual(project);
    expect((await db.query('SELECT count(*)::int AS count FROM direction')).rows[0].count).toBe(1);
  });

  it('blocks cross-account writes, CSRF, invalid IR, and more than three directions', async () => {
    const signup = await app.inject({ method: 'POST', url: '/api/auth/signup', headers: headers(), payload: { email: 'second@example.test', password } });
    const otherCookie = cookieOf(signup);
    const other = await app.inject({ method: 'GET', url: '/api/project', headers: headers(otherCookie) });
    expect(other.json().project).toBeNull();
    await db.query("UPDATE app_user SET onboarding_step='complete' WHERE email='second@example.test'");
    const attack = await app.inject({ method: 'PUT', url: '/api/project', headers: headers(otherCookie), payload: { project, version: 2 } });
    expect(attack.statusCode).toBe(404);
    const csrf = await app.inject({ method: 'POST', url: '/api/auth/signout', headers: { ...headers(primaryCookie), origin: 'https://another.example' }, payload: {} });
    expect(csrf.statusCode).toBe(403);
    const broken = structuredClone(project) as { directions: { document: { pages: { root: { children: { variant: string }[] } }[] } }[] };
    broken.directions[0].document.pages[0].root.children[1].variant = 'unsupported';
    expect((await app.inject({ method: 'PUT', url: '/api/project', headers: headers(primaryCookie), payload: { project: broken, version: 2 } })).statusCode).toBe(400);
    const full = structuredClone(project) as { directions: { id: string }[] }; full.directions = Array.from({ length: 4 }, (_, index) => ({ ...full.directions[0], id: `direction-${index}` }));
    expect((await app.inject({ method: 'PUT', url: '/api/project', headers: headers(primaryCookie), payload: { project: full, version: 2 } })).statusCode).toBe(400);
  });

  it('synchronizes project metadata, preserves snapshots, and permits only one concurrent save', async () => {
    const edited = structuredClone(project) as Project;
    edited.name = 'Updated studio'; edited.brief = 'A new description for the studio.'; edited.productType = 'Agency / studio';
    edited.designSystem.name = 'Studio foundations'; edited.designSystem.accent = '#123456';
    edited.directions[0].strategy = 'editorial';
    const results = await Promise.all([0, 1].map(() => app.inject({ method: 'PUT', url: '/api/project', headers: headers(primaryCookie), payload: { project: edited, version: 2 } })));
    expect(results.map(result => result.statusCode).sort()).toEqual([200, 409]);
    const saved = results.find(result => result.statusCode === 200)!.json();
    expect(saved.project.designSystem.version).toBe(2);
    expect(saved.project.directions[0].document.designSystemVersion).toBe(2);
    const row = (await db.query('SELECT name,brief,product_type FROM project WHERE id=$1', [edited.id])).rows[0];
    expect(row).toEqual({ name: edited.name, brief: edited.brief, product_type: 'AGENCY_STUDIO' });
    expect((await db.query("SELECT strategy FROM direction WHERE project_id=$1 AND status='READY'", [edited.id])).rows[0].strategy).toBe('EDITORIAL');
    const snapshots = (await db.query('SELECT version,tokens FROM design_system_version WHERE design_system_id=$1 ORDER BY version', [edited.designSystem.id])).rows;
    expect(snapshots).toHaveLength(2); expect(snapshots[0].tokens).toEqual((project as Project).designSystem);
    const undo = await app.inject({ method: 'PUT', url: '/api/project', headers: headers(primaryCookie), payload: { project, version: saved.version } });
    expect(undo.statusCode, undo.body).toBe(200); expect(undo.json().project.designSystem.version).toBe(1);
    const malformed = await app.inject({ method: 'PUT', url: '/api/project', headers: headers(primaryCookie), payload: { project: { ...edited, id: 'not-a-uuid' }, version: 4 } });
    expect(malformed.statusCode).toBe(400);
  });

  it('resets a password once and invalidates existing sessions', async () => {
    const forgot = await app.inject({ method: 'POST', url: '/api/auth/forgot-password', headers: headers(), payload: { email: primaryEmail } });
    const unknown = await app.inject({ method: 'POST', url: '/api/auth/forgot-password', headers: headers(), payload: { email: 'absent@example.test' } });
    expect(forgot.body).toBe(unknown.body); expect(forgot.body).not.toContain(emails[0].token);
    const payload = { token: emails[0].token, password: `${password} new` };
    const resets = await Promise.all([0,1].map(() => app.inject({ method: 'POST', url: '/api/auth/reset-password', headers: headers(), payload })));
    expect(resets.map(result => result.statusCode).sort()).toEqual([200,400]);
    expect((await app.inject({ method: 'GET', url: '/api/auth/session', headers: headers(primaryCookie) })).statusCode).toBe(401);
    const old = await app.inject({ method: 'POST', url: '/api/auth/signin', headers: headers(), payload: { email: primaryEmail, password } }); expect(old.statusCode).toBe(401);
    const login = await app.inject({ method: 'POST', url: '/api/auth/signin', headers: headers(), payload: { email: primaryEmail, password: `${password} new` } });
    expect(login.statusCode, login.body).toBe(200); primaryCookie = cookieOf(login);
    expect(login.json().user.onboardingStep).toBe('complete');
  });

  it('requires a second factor and consumes recovery codes only once', async () => {
    const setup = await app.inject({ method: 'POST', url: '/api/auth/two-factor/setup', headers: headers(primaryCookie), payload: { password: `${password} new` } });
    expect(setup.statusCode, setup.body).toBe(200);
    const code = authenticator(setup.json().secret, primaryEmail).generate();
    const enable = await app.inject({ method: 'POST', url: '/api/auth/two-factor/enable', headers: headers(primaryCookie), payload: { code } });
    expect(enable.statusCode, enable.body).toBe(200); primaryCookie = cookieOf(enable);
    const recoveryCodes: string[] = enable.json().recoveryCodes; expect(recoveryCodes).toHaveLength(8);
    const login = await app.inject({ method: 'POST', url: '/api/auth/signin', headers: headers(), payload: { email: primaryEmail, password: `${password} new` } });
    expect(login.json()).toEqual({ requiresTwoFactor: true }); const challenge = cookieOf(login);
    expect((await app.inject({ method: 'GET', url: '/api/project', headers: headers(challenge) })).statusCode).toBe(401);
    const verified = await app.inject({ method: 'POST', url: '/api/auth/two-factor/verify', headers: headers(challenge), payload: { code: recoveryCodes[0] } });
    expect(verified.statusCode, verified.body).toBe(200); primaryCookie = cookieOf(verified);
    const replay = await app.inject({ method: 'POST', url: '/api/auth/two-factor/verify', headers: headers(challenge), payload: { code: recoveryCodes[0] } });
    expect(replay.statusCode).toBe(401);
    const reused = await app.inject({ method: 'POST', url: '/api/auth/two-factor/disable', headers: headers(primaryCookie), payload: { password: `${password} new`, code: recoveryCodes[0] } });
    expect(reused.statusCode).toBe(400);
    const disabled = await app.inject({ method: 'POST', url: '/api/auth/two-factor/disable', headers: headers(primaryCookie), payload: { password: `${password} new`, code: recoveryCodes[1] } });
    expect(disabled.statusCode, disabled.body).toBe(200); primaryCookie = cookieOf(disabled);
  });

  it('changes passwords and enforces account disabled state and expired reset links', async () => {
    const change = await app.inject({ method: 'POST', url: '/api/auth/change-password', headers: headers(primaryCookie), payload: { currentPassword: `${password} new`, password: `${password} final` } });
    expect(change.statusCode, change.body).toBe(200);
    expect((await app.inject({ method: 'GET', url: '/api/auth/session', headers: headers(primaryCookie) })).statusCode).toBe(401);
    primaryCookie = cookieOf(change);
    await app.inject({ method: 'POST', url: '/api/auth/forgot-password', headers: headers(), payload: { email: primaryEmail } });
    await db.query("UPDATE password_reset SET expires_at=now()-interval '1 minute'");
    expect((await app.inject({ method: 'POST', url: '/api/auth/reset-password', headers: headers(), payload: { token: emails.at(-1)!.token, password } })).statusCode).toBe(400);
    const disabled = await app.inject({ method: 'POST', url: '/api/auth/disable-account', headers: headers(primaryCookie), payload: { password: `${password} final` } });
    expect(disabled.statusCode, disabled.body).toBe(200);
    expect((await app.inject({ method: 'GET', url: '/api/auth/session', headers: headers(primaryCookie) })).statusCode).toBe(401);
    expect((await app.inject({ method: 'POST', url: '/api/auth/signin', headers: headers(), payload: { email: primaryEmail, password: `${password} final` } })).statusCode).toBe(401);
  });

  it('returns client errors for malformed, unsupported, and oversized bodies', async () => {
    const malformed = await app.inject({ method: 'POST', url: '/api/auth/signin', headers: { ...headers(), 'content-type': 'application/json' }, payload: '{' });
    expect(malformed.statusCode).toBe(400);
    const oversized = await app.inject({ method: 'POST', url: '/api/auth/signin', headers: { ...headers(), 'content-type': 'application/json' }, payload: JSON.stringify({ email: 'a'.repeat(1024 * 1024) }) });
    expect(oversized.statusCode).toBe(413);
    const unsupported = await app.inject({ method: 'POST', url: '/api/auth/signin', headers: { ...headers(), 'content-type': 'application/xml' }, payload: '<test/>' });
    expect(unsupported.statusCode).toBe(415);
  });

  it('keeps reset responses private when email delivery fails and removes the unusable token', async () => {
    const failing = await createServer(db, loadConfig(), async () => { throw new Error('Mail unavailable'); });
    try {
      const known = await failing.inject({ method: 'POST', url: '/api/auth/forgot-password', headers: headers(), payload: { email: 'second@example.test' } });
      const unknown = await failing.inject({ method: 'POST', url: '/api/auth/forgot-password', headers: headers(), payload: { email: 'missing@example.test' } });
      expect(known.statusCode).toBe(200); expect(known.body).toBe(unknown.body);
      expect((await db.query("SELECT count(*)::int AS count FROM password_reset r JOIN app_user u ON u.id=r.user_id WHERE u.email='second@example.test'")).rows[0].count).toBe(0);
    } finally { await failing.close(); }
  });

  it('limits repeated sign-in attempts for a normalized email', async () => {
    for (let index = 0; index < 15; index++) {
      expect((await app.inject({ method: 'POST', url: '/api/auth/signin', headers: headers(), payload: { email: 'rate@example.test', password } })).statusCode).toBe(401);
    }
    expect((await app.inject({ method: 'POST', url: '/api/auth/signin', headers: headers(), payload: { email: 'RATE@example.test', password } })).statusCode).toBe(429);
  });
});
