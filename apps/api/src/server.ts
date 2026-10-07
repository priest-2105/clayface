import Fastify, { type FastifyRequest, type FastifyReply } from 'fastify';
import cookie from '@fastify/cookie';
import { z, ZodError } from 'zod';
import { emailSchema, passwordSchema, nameSchema, normalizeEmail } from '@clayface/auth';
import { projectSchema, strategySchema } from '@clayface/schema';
import { validateDocument } from '@clayface/registry';
import { createSampleProject } from '@clayface/registry/fixtures';
import { generateDirection } from '@clayface/generator';
import { randomUUID } from 'node:crypto';
import type { Config } from './config';
import { isTrustedOrigin } from './config';
import { transaction, type Database, type Transaction } from './database';
import { authenticator, consumeFactor, decrypt, digest, encrypt, hashPassword, HttpError, newRecoveryCodes, newSecret, token, verifyPassword } from './security';
import { createMailer } from './mail';
import QRCode from 'qrcode';

type User = { id: string; email: string; name: string | null; password_hash: string | null; auth_version: number; disabled_at: Date | null; onboarding_step: string; totp_secret: string | null; totp_pending: string | null; totp_pending_expires_at: Date | null; totp_last_step: string };
const credentials = z.object({ email: emailSchema.max(320), password: z.string().min(1).max(128) });
const newPassword = passwordSchema.refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'Use a password no longer than 72 UTF-8 bytes.');
const factorInput = z.object({ code: z.string().trim().min(6).max(64) });
const publicUser = (u: User) => ({ id: u.id, email: u.email, name: u.name, onboardingStep: u.onboarding_step, twoFactorEnabled: Boolean(u.totp_secret) });

export async function createServer(db: Database, config: Config, sendMail = createMailer(config)) {
  const app = Fastify({ bodyLimit: 1024 * 1024, logger: { level: 'error' } });
  await app.register(cookie);
  const cookieName = 'clayface_session';
  const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const, secure: config.APP_ORIGIN.startsWith('https://') };
  const dummyHash = await hashPassword(token());
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) return reply.code(400).send({ message: error.issues[0]?.message ?? 'Check the form and try again.' });
    if (error instanceof HttpError) return reply.code(error.statusCode).send({ message: error.message });
    const status = (error as { statusCode?: number }).statusCode;
    if (status && status >= 400 && status < 500) return reply.code(status).send({ message: status === 413 ? 'This request is too large.' : 'The request could not be read. Check its format and try again.' });
    if ((error as { code?: string }).code === '23505') return reply.code(409).send({ message: 'That account or project already exists.' });
    app.log.error({ err: error }, 'Request failed');
    return reply.code(500).send({ message: 'We could not complete that request. Please try again.' });
  });
  app.addHook('onRequest', async (request, reply) => {
    reply.header('Cache-Control', 'no-store');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      if (!isTrustedOrigin(request.headers.origin, config)) throw new HttpError(403, `This address is not allowed to make changes. Open Clayface at ${config.APP_ORIGIN} and try again.`);
      if (request.headers['x-clayface-request'] !== '1') throw new HttpError(403, 'This request is missing its security header. Refresh Clayface and try again.');
    }
  });
  async function limit(request: FastifyRequest, scope: string, identity = '', max = 15) {
    for (const key of [`${scope}:ip:${request.ip}`, ...(identity ? [`${scope}:identity:${digest(identity)}`] : [])]) {
      const { rows } = await db.query(`INSERT INTO auth_rate_limit(key,count,reset_at) VALUES($1,1,now()+interval '15 minutes') ON CONFLICT(key) DO UPDATE SET count=CASE WHEN auth_rate_limit.reset_at<now() THEN 1 ELSE auth_rate_limit.count+1 END, reset_at=CASE WHEN auth_rate_limit.reset_at<now() THEN now()+interval '15 minutes' ELSE auth_rate_limit.reset_at END RETURNING count`, [key]);
      if (rows[0].count > (key.includes(':ip:') ? max * 10 : max)) throw new HttpError(429, 'Too many attempts. Please wait 15 minutes and try again.');
    }
  }
  async function current(request: FastifyRequest, tx: Database | Transaction = db, kind = 'session'): Promise<User> {
    const raw = request.cookies[cookieName];
    if (!raw) throw new HttpError(401, 'Please sign in to continue.');
    const { rows } = await tx.query(`SELECT u.* FROM app_user u JOIN auth_session s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.kind=$2 AND s.expires_at>now() AND s.auth_version=u.auth_version AND u.disabled_at IS NULL`, [digest(raw), kind]);
    if (!rows[0]) throw new HttpError(401, 'Your session has ended. Please sign in again.');
    return rows[0];
  }
  async function lockUser(request: FastifyRequest, tx: Transaction, kind = 'session') {
    const user = await current(request, tx, kind);
    await tx.query('SELECT id FROM app_user WHERE id=$1 FOR UPDATE', [user.id]);
    return current(request, tx, kind);
  }
  async function issue(tx: Transaction, user: User, kind: 'session' | 'challenge', request: FastifyRequest) {
    const raw = token(), seconds = kind === 'session' ? 604800 : 300;
    if (request.cookies[cookieName]) await tx.query('DELETE FROM auth_session WHERE token_hash=$1', [digest(request.cookies[cookieName])]);
    await tx.query('INSERT INTO auth_session(token_hash,user_id,auth_version,kind,expires_at) VALUES($1,$2,$3,$4,now()+$5*interval \'1 second\')', [digest(raw), user.id, user.auth_version, kind, seconds]);
    return { raw, seconds };
  }
  function setSession(reply: FastifyReply, session: { raw: string; seconds: number }) { reply.setCookie(cookieName, session.raw, { ...cookieOptions, maxAge: session.seconds }); }
  async function requirePassword(user: User, password: string) { if (!await verifyPassword(password, user.password_hash)) throw new HttpError(400, 'Your current password is incorrect.'); }

  async function loadProject(source: Database | Transaction, userId: string, projectId?: string) {
    const projectResult = await source.query("SELECT p.id,p.name,p.product_type,p.brief,p.page_names,p.workspace_document,p.project_version,ds.id AS design_system_id,dsv.tokens AS design_tokens,dsv.version AS design_version FROM project p LEFT JOIN design_system ds ON ds.project_id=p.id LEFT JOIN LATERAL (SELECT tokens,version FROM design_system_version WHERE design_system_id=ds.id ORDER BY version DESC LIMIT 1) dsv ON true WHERE p.user_id=$1 AND p.status='ACTIVE' AND ($2::uuid IS NULL OR p.id=$2) LIMIT 1", [userId, projectId ?? null]);
    const row = projectResult.rows[0]; if (!row) return null;
    const directions = await source.query("SELECT id,name,strategy,document FROM direction WHERE project_id=$1 AND status IN ('READY','DRAFT','GENERATING','FAILED') ORDER BY created_at ASC", [row.id]);
    if (!row.design_system_id || !row.design_tokens || !directions.rows.length) return row.workspace_document ? projectSchema.parse(row.workspace_document) : null;
    const productType = row.product_type === 'AGENCY_STUDIO' ? 'Agency / studio' : row.product_type === 'SERVICE_BUSINESS' ? 'Service business' : 'Software / SaaS';
    try { return projectSchema.parse({ schemaVersion: 1, id: row.id, name: row.name, productType, brief: row.brief, designSystem: { ...row.design_tokens, id: row.design_system_id, version: row.design_version }, directions: directions.rows.map(item => ({ id: item.id, name: item.name, description: item.description, strategy: String(item.strategy).toLowerCase() === 'minimal' ? 'minimal' : String(item.strategy).toLowerCase() === 'editorial' ? 'editorial' : 'product', document: item.document })) }); }
    catch { return row.workspace_document ? projectSchema.parse(row.workspace_document) : null; }
  }

  app.get('/api/health', async () => { await db.query('SELECT 1'); return { ok: true }; });
  app.get('/api/auth/session', async request => ({ user: publicUser(await current(request)) }));
  app.post('/api/auth/signup', async (request, reply) => {
    const data = credentials.extend({ password: newPassword }).parse(request.body), email = normalizeEmail(data.email);
    await limit(request, 'signup', email, 10);
    const passwordHash = await hashPassword(data.password);
    const result = await transaction(db, async tx => {
      const { rows } = await tx.query('INSERT INTO app_user(email,password_hash) VALUES($1,$2) RETURNING *', [email, passwordHash]);
      const user: User = rows[0]; return { user, session: await issue(tx, user, 'session', request) };
    });
    setSession(reply, result.session); return { user: publicUser(result.user) };
  });
  app.post('/api/auth/signin', async (request, reply) => {
    const data = credentials.parse(request.body), email = normalizeEmail(data.email);
    await limit(request, 'signin', email);
    const { rows } = await db.query('SELECT * FROM app_user WHERE email=$1', [email]);
    const user: User | undefined = rows[0];
    const valid = await verifyPassword(data.password, user?.password_hash ?? dummyHash);
    if (!user || !valid || user.disabled_at) throw new HttpError(401, 'Email or password is incorrect.');
    const result = await transaction(db, async tx => {
      const fresh: User = (await tx.query('SELECT * FROM app_user WHERE id=$1 FOR UPDATE', [user.id])).rows[0];
      if (fresh.disabled_at || fresh.auth_version !== user.auth_version) throw new HttpError(401, 'Please sign in again.');
      return { user: fresh, session: await issue(tx, fresh, fresh.totp_secret ? 'challenge' : 'session', request) };
    });
    setSession(reply, result.session); return result.user.totp_secret ? { requiresTwoFactor: true } : { user: publicUser(result.user) };
  });
  app.post('/api/auth/two-factor/verify', async (request, reply) => {
    const { code } = factorInput.parse(request.body); await limit(request, 'factor', (await current(request, db, 'challenge')).id);
    const result = await transaction(db, async tx => {
      const user = await lockUser(request, tx, 'challenge'); await consumeFactor(tx, user, code, config.AUTH_ENCRYPTION_KEY);
      return { user, session: await issue(tx, user, 'session', request) };
    });
    setSession(reply, result.session); return { user: publicUser(result.user) };
  });
  app.post('/api/auth/signout', async (request, reply) => {
    if (request.cookies[cookieName]) await db.query('DELETE FROM auth_session WHERE token_hash=$1', [digest(request.cookies[cookieName])]);
    reply.clearCookie(cookieName, cookieOptions); return { ok: true };
  });
  app.post('/api/auth/forgot-password', async request => {
    const { email: input } = z.object({ email: emailSchema }).parse(request.body), email = normalizeEmail(input);
    await limit(request, 'forgot', email, 5);
    const { rows } = await db.query('SELECT id FROM app_user WHERE email=$1 AND disabled_at IS NULL', [email]);
    if (rows[0]) {
      const raw = token();
      await transaction(db, async tx => {
        await tx.query('SELECT id FROM app_user WHERE id=$1 FOR UPDATE', [rows[0].id]);
        await tx.query('DELETE FROM password_reset WHERE user_id=$1', [rows[0].id]);
        await tx.query('INSERT INTO password_reset(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval \'30 minutes\')', [digest(raw), rows[0].id]);
      });
      try { await sendMail(email, raw); } catch {
        await db.query('DELETE FROM password_reset WHERE token_hash=$1', [digest(raw)]);
        // Keep the public response identical for registered and unknown addresses.
        app.log.error('Password reset email delivery failed');
      }
    }
    return { message: 'If an account matches that email, a reset link is on its way.' };
  });
  app.post('/api/auth/reset-password', async request => {
    const data = z.object({ token: z.string().length(64), password: newPassword }).parse(request.body); await limit(request, 'reset');
    const passwordHash = await hashPassword(data.password);
    await transaction(db, async tx => {
      const found = await tx.query('SELECT user_id FROM password_reset WHERE token_hash=$1 AND expires_at>now()', [digest(data.token)]);
      if (!found.rows[0]) throw new HttpError(400, 'This reset link has expired or was already used. Request a new link.');
      const id = found.rows[0].user_id;
      await tx.query('SELECT id FROM app_user WHERE id=$1 FOR UPDATE', [id]);
      const consumed = await tx.query('DELETE FROM password_reset WHERE token_hash=$1 AND expires_at>now() RETURNING user_id', [digest(data.token)]);
      if (!consumed.rowCount) throw new HttpError(400, 'This reset link has expired or was already used. Request a new link.');
      await tx.query('UPDATE app_user SET password_hash=$2,auth_version=auth_version+1 WHERE id=$1 AND disabled_at IS NULL', [id, passwordHash]);
      await tx.query('DELETE FROM auth_session WHERE user_id=$1', [id]);
      await tx.query('DELETE FROM password_reset WHERE user_id=$1', [id]);
    }); return { ok: true };
  });
  app.post('/api/auth/change-password', async (request, reply) => {
    const data = z.object({ currentPassword: z.string().max(128), password: newPassword, code: z.string().max(64).default('') }).parse(request.body);
    await limit(request, 'security'); const passwordHash = await hashPassword(data.password);
    const session = await transaction(db, async tx => {
      const user = await lockUser(request, tx); await requirePassword(user, data.currentPassword);
      if (user.totp_secret) await consumeFactor(tx, user, data.code, config.AUTH_ENCRYPTION_KEY);
      await tx.query('UPDATE app_user SET password_hash=$2,auth_version=auth_version+1 WHERE id=$1', [user.id, passwordHash]);
      await tx.query('DELETE FROM auth_session WHERE user_id=$1', [user.id]); await tx.query('DELETE FROM password_reset WHERE user_id=$1', [user.id]);
      return issue(tx, { ...user, auth_version: user.auth_version + 1 }, 'session', request);
    }); setSession(reply, session); return { ok: true };
  });
  app.post('/api/auth/two-factor/setup', async request => {
    const { password } = z.object({ password: z.string().max(128) }).parse(request.body); await limit(request, 'security');
    return transaction(db, async tx => {
      const user = await lockUser(request, tx); await requirePassword(user, password);
      if (user.totp_secret) throw new HttpError(409, 'Two-factor authentication is already enabled.');
      const secret = newSecret(); await tx.query('UPDATE app_user SET totp_pending=$2,totp_pending_expires_at=now()+interval \'10 minutes\' WHERE id=$1', [user.id, encrypt(secret, config.AUTH_ENCRYPTION_KEY)]);
      const uri = authenticator(secret, user.email).toString();
      return { secret, uri, qrCode: await QRCode.toDataURL(uri, { width: 224, margin: 2 }) };
    });
  });
  app.post('/api/auth/disable-account', async (request, reply) => {
    const data = z.object({ password: z.string().max(128), code: z.string().max(64).default('') }).parse(request.body);
    await limit(request, 'security');
    await transaction(db, async tx => {
      const user = await lockUser(request, tx); await requirePassword(user, data.password);
      if (user.totp_secret) await consumeFactor(tx, user, data.code, config.AUTH_ENCRYPTION_KEY);
      await tx.query('UPDATE app_user SET disabled_at=now(),auth_version=auth_version+1,updated_at=now() WHERE id=$1', [user.id]);
      await tx.query('DELETE FROM auth_session WHERE user_id=$1', [user.id]);
      await tx.query('DELETE FROM password_reset WHERE user_id=$1', [user.id]);
    });
    reply.clearCookie(cookieName, cookieOptions); return { ok: true };
  });
  app.post('/api/auth/two-factor/enable', async (request, reply) => {
    const { code } = factorInput.parse(request.body); await limit(request, 'factor', (await current(request)).id);
    const result = await transaction(db, async tx => {
      const user = await lockUser(request, tx);
      if (!user.totp_pending || !user.totp_pending_expires_at || user.totp_pending_expires_at.getTime() < Date.now()) throw new HttpError(400, 'Setup has expired. Start again.');
      const delta = authenticator(decrypt(user.totp_pending, config.AUTH_ENCRYPTION_KEY), user.email).validate({ token: code, window: 1 });
      if (delta === null) throw new HttpError(400, 'That code is incorrect. Check your authenticator and try again.');
      const codes = newRecoveryCodes(); await tx.query('DELETE FROM recovery_code WHERE user_id=$1', [user.id]);
      for (const value of codes) await tx.query('INSERT INTO recovery_code(user_id,code_hash) VALUES($1,$2)', [user.id, digest(value)]);
      await tx.query('UPDATE app_user SET totp_secret=totp_pending,totp_pending=NULL,totp_pending_expires_at=NULL,totp_last_step=$2,auth_version=auth_version+1 WHERE id=$1', [user.id, Math.floor(Date.now() / 30000) + delta]);
      await tx.query('DELETE FROM auth_session WHERE user_id=$1', [user.id]);
      return { codes, session: await issue(tx, { ...user, auth_version: user.auth_version + 1 }, 'session', request) };
    }); setSession(reply, result.session); return { recoveryCodes: result.codes };
  });
  app.post('/api/auth/two-factor/disable', async (request, reply) => {
    const data = factorInput.extend({ password: z.string().max(128) }).parse(request.body); await limit(request, 'security');
    const session = await transaction(db, async tx => {
      const user = await lockUser(request, tx); await requirePassword(user, data.password); await consumeFactor(tx, user, data.code, config.AUTH_ENCRYPTION_KEY);
      await tx.query('UPDATE app_user SET totp_secret=NULL,totp_pending=NULL,totp_last_step=-1,auth_version=auth_version+1 WHERE id=$1', [user.id]);
      await tx.query('DELETE FROM recovery_code WHERE user_id=$1', [user.id]); await tx.query('DELETE FROM auth_session WHERE user_id=$1', [user.id]);
      return issue(tx, { ...user, auth_version: user.auth_version + 1 }, 'session', request);
    }); setSession(reply, session); return { ok: true };
  });

  app.post('/api/onboarding/name', async request => {
    const { name } = z.object({ name: nameSchema }).parse(request.body);
    return transaction(db, async tx => { const user = await lockUser(request, tx);
      const { rows } = await tx.query("UPDATE app_user SET name=$2,onboarding_step=CASE WHEN onboarding_step='name' THEN 'project' ELSE onboarding_step END WHERE id=$1 RETURNING *", [user.id, name]);
      return { user: publicUser(rows[0]) };
    });
  });
  const projectInput = z.object({ name: z.string().trim().min(1).max(80), productType: projectSchema.shape.productType, brief: z.string().trim().min(10).max(1000), pages: z.array(z.enum(['Home','Features','Pricing','About','Contact'])).min(1).max(5).refine(items => new Set(items).size === items.length && items.includes('Home'), 'Include Home and choose each page once.') });
  app.post('/api/onboarding/project', async request => {
    const data = projectInput.parse(request.body);
    return transaction(db, async tx => {
      const user = await lockUser(request, tx); if (user.onboarding_step === 'name') throw new HttpError(409, 'Enter your name first.');
      if (user.onboarding_step === 'complete') throw new HttpError(409, 'Your project is already set up.');
      const existing = await tx.query("SELECT id FROM project WHERE user_id=$1 AND status='ACTIVE'", [user.id]);
      const id = existing.rows[0]?.id ?? randomUUID();
      const type = { 'Software / SaaS': 'SOFTWARE_SAAS', 'Agency / studio': 'AGENCY_STUDIO', 'Service business': 'SERVICE_BUSINESS' }[data.productType];
      if (existing.rowCount) await tx.query('UPDATE project SET name=$2,product_type=$3,brief=$4,page_names=$5 WHERE id=$1', [id,data.name,type,data.brief,JSON.stringify(data.pages)]);
      else await tx.query('INSERT INTO project(id,user_id,name,product_type,brief,page_names) VALUES($1,$2,$3,$4,$5,$6)', [id,user.id,data.name,type,data.brief,JSON.stringify(data.pages)]);
      const { rows } = await tx.query("UPDATE app_user SET onboarding_step='design' WHERE id=$1 RETURNING *", [user.id]); return { user: publicUser(rows[0]) };
    });
  });
  app.get('/api/project', async request => {
    const user = await current(request); const project = await loadProject(db, user.id); const { rows } = await db.query("SELECT project_version FROM project WHERE user_id=$1 AND status='ACTIVE'", [user.id]);
    return { project, version: rows[0]?.project_version ?? null };
  });
  app.post('/api/onboarding/design', async request => {
    const { strategy } = z.object({ strategy: strategySchema }).parse(request.body);
    return transaction(db, async tx => {
      const user = await lockUser(request, tx);
      const row = (await tx.query("SELECT * FROM project WHERE user_id=$1 AND status='ACTIVE' FOR UPDATE", [user.id])).rows[0];
      if (user.onboarding_step === 'complete') return { user: publicUser(user), project: await loadProject(tx, user.id, row?.id) ?? (row?.workspace_document ? projectSchema.parse(row.workspace_document) : null), version: row?.project_version };
      if (user.onboarding_step !== 'design' || !row) throw new HttpError(409, 'Finish your project details first.');
      const project = createSampleProject(); project.id = row.id; project.name = row.name; project.brief = row.brief;
      project.productType = row.product_type === 'AGENCY_STUDIO' ? 'Agency / studio' : row.product_type === 'SERVICE_BUSINESS' ? 'Service business' : 'Software / SaaS';
      project.designSystem = { ...project.designSystem, id: randomUUID(), name: `${row.name.slice(0, 60)} foundations` };
      const generated = generateDirection({ brand: project.name, brief: project.brief, productType: project.productType, pages: row.page_names, strategy, designSystemId: project.designSystem.id, designSystemVersion: 1 });
      generated.direction.id = randomUUID(); project.directions = [generated.direction];
      const versionId = randomUUID();
      await tx.query('INSERT INTO design_system(id,project_id,name) VALUES($1,$2,$3)', [project.designSystem.id,row.id,project.designSystem.name]);
      await tx.query('INSERT INTO design_system_version(id,design_system_id,version,tokens) VALUES($1,$2,1,$3)', [versionId,project.designSystem.id,JSON.stringify(project.designSystem)]);
      await tx.query("INSERT INTO direction(id,project_id,design_system_version_id,name,description,strategy,status,document) VALUES($1,$2,$3,$4,$5,$6,'READY',$7)", [generated.direction.id,row.id,versionId,generated.direction.name,generated.direction.description,strategy.toUpperCase(),JSON.stringify(generated.direction.document)]);
      await tx.query('UPDATE project SET active_design_system_version_id=$2,workspace_document=$3 WHERE id=$1', [row.id,versionId,JSON.stringify(project)]);
      const updated = (await tx.query("UPDATE app_user SET onboarding_step='complete' WHERE id=$1 RETURNING *", [user.id])).rows[0];
      return { user: publicUser(updated), project, version: row.project_version };
    });
  });
  app.put('/api/project', async request => {
    const { project, version } = z.object({ project: projectSchema.extend({ id: z.string().uuid() }), version: z.number().int().positive().max(2147483646) }).parse(request.body);
    if (project.designSystem.version > 2147483646) throw new HttpError(400, 'The design-system version is out of range.');
    const ids = new Set<string>();
    for (const direction of project.directions) {
      if (ids.has(direction.id)) throw new HttpError(400, 'Each direction must have a unique identity.'); ids.add(direction.id);
      try { validateDocument(direction.document); } catch { throw new HttpError(400, 'This design contains an unsupported component or invalid page structure.'); }
      if (direction.document.designSystemId !== project.designSystem.id || direction.document.designSystemVersion !== project.designSystem.version) throw new HttpError(400, 'A direction references the wrong design system.');
    }
    return transaction(db, async tx => {
      const user = await lockUser(request, tx); if (user.onboarding_step !== 'complete') throw new HttpError(409, 'Finish setup first.');
      const row = (await tx.query("SELECT * FROM project WHERE user_id=$1 AND id=$2 AND status='ACTIVE' FOR UPDATE", [user.id,project.id])).rows[0];
      if (!row) throw new HttpError(404, 'Project not found.');
      if (row.project_version !== version) throw new HttpError(409, 'This project changed in another tab. Download your work, then reload before saving.');
      const previous = await loadProject(tx, user.id, project.id) ?? (row.workspace_document ? projectSchema.parse(row.workspace_document) : null);
      if (!previous) throw new HttpError(409, 'This project has no persisted design. Reload and try again.');
      if (project.designSystem.id !== previous.designSystem.id) throw new HttpError(400, 'The project design-system identity cannot change.');
      // Immutable snapshots also survive undo/redo: a reused version must have identical tokens.
      const stored = (await tx.query('SELECT * FROM design_system_version WHERE design_system_id=$1 AND version=$2', [project.designSystem.id,project.designSystem.version])).rows[0];
      let versionId = stored?.id;
      if (stored && JSON.stringify(projectSchema.shape.designSystem.parse(stored.tokens)) !== JSON.stringify(project.designSystem)) {
        const max = (await tx.query('SELECT max(version) AS version FROM design_system_version WHERE design_system_id=$1', [project.designSystem.id])).rows[0].version;
        project.designSystem.version = max + 1;
        for (const direction of project.directions) direction.document.designSystemVersion = project.designSystem.version;
        versionId = undefined;
      }
      if (!versionId) { versionId = randomUUID(); await tx.query('INSERT INTO design_system_version(id,design_system_id,version,tokens) VALUES($1,$2,$3,$4)', [versionId,project.designSystem.id,project.designSystem.version,JSON.stringify(project.designSystem)]); }
      await tx.query("UPDATE direction SET status='ARCHIVED' WHERE project_id=$1", [project.id]);
      for (const direction of project.directions) {
        // Stable local IDs are mapped under the owned project; IDs never grant access.
        const old = (await tx.query('SELECT id FROM direction WHERE project_id=$1 AND legacy_design_id=$2', [project.id,`${project.id}:${direction.id}`])).rows[0];
        const direct = (await tx.query('SELECT id FROM direction WHERE project_id=$1 AND id::text=$2', [project.id,direction.id])).rows[0];
        if (old || direct) await tx.query("UPDATE direction SET document=$2,design_system_version_id=$3,name=$4,description=$5,strategy=$6,status='READY',direction_version=direction_version+1,updated_at=now() WHERE id=$1", [(old ?? direct).id,JSON.stringify(direction.document),versionId,direction.name,direction.description,direction.strategy.toUpperCase()]);
        else await tx.query("INSERT INTO direction(project_id,design_system_version_id,legacy_design_id,name,description,strategy,status,document) VALUES($1,$2,$3,$4,$5,$6,'READY',$7)", [project.id,versionId,`${project.id}:${direction.id}`,direction.name,direction.description,direction.strategy.toUpperCase(),JSON.stringify(direction.document)]);
      }
      const productType = { 'Software / SaaS': 'SOFTWARE_SAAS', 'Agency / studio': 'AGENCY_STUDIO', 'Service business': 'SERVICE_BUSINESS' }[project.productType];
      await tx.query('UPDATE design_system SET name=$2 WHERE id=$1', [project.designSystem.id, project.designSystem.name]);
      await tx.query('UPDATE project SET workspace_document=$2,project_version=project_version+1,active_design_system_version_id=$3,name=$4,brief=$5,product_type=$6,updated_at=now() WHERE id=$1', [project.id,JSON.stringify(project),versionId,project.name,project.brief,productType]);
      return { project, version: version + 1 };
    });
  });
  return app;
}
