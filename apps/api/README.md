# Clayface API

Fastify and PostgreSQL implement password authentication, optional authenticator-based two-factor authentication, resumable onboarding, and account-owned workspace persistence. Queries use `pg` with explicit transactions; Drizzle is not integrated.

## Local setup

Requires Node 22+, pnpm 10.17.1, and PostgreSQL 17. From the repository root:

1. Copy `.env.example` to `.env`, set `DATABASE_URL` to a local `clayface_dev` database, and generate `AUTH_ENCRYPTION_KEY` using the command in the example. Keep the same key across restarts so existing authenticator secrets remain readable.
2. Start PostgreSQL. `pnpm db:start` starts this workspace's existing isolated cluster on port 55432; it does not install PostgreSQL or initialize a new cluster. On another machine, use your own local PostgreSQL service.
3. Run `pnpm --filter @clayface/api db:create` if the development database does not exist, then `pnpm db:migrate`.
4. Run `pnpm dev` for both services, or `pnpm dev:api` and `pnpm dev:web` in separate terminals.

The API listens on loopback port 4000. The web app proxies `/api` to that port. Open `http://127.0.0.1:3000` or `http://localhost:3000`. In development, loopback hostname aliases are accepted only on the configured port; cookies remain separate per hostname, so use one consistently. Production accepts only the exact `APP_ORIGIN`. Mutating requests also require `X-Clayface-Request: 1`, which the web client sends automatically. Do not disable these protections to fix a hostname mismatch.

`MAIL_MODE=local` writes reset emails to the ignored `.local-mail/` directory. `MAIL_MODE=smtp` uses the configured SMTP server. Production configuration requires HTTPS and SMTP. Keep the API private behind the web proxy; forwarded client-IP headers are not trusted. IP limits therefore apply to the proxy's shared address, alongside separate identity limits for sign-in, signup, reset requests, and factor verification.

## Routes

All routes are under `/api`. `GET /health` checks the database; `GET /auth/session` returns the current public account. POST routes:

| Route | Body |
| --- | --- |
| `/auth/signup`, `/auth/signin` | `email`, `password` |
| `/auth/signout` | `{}` |
| `/auth/forgot-password` | `email` |
| `/auth/reset-password` | `token`, `password` |
| `/auth/change-password` | `currentPassword`, `password`, `code` when two-factor is enabled |
| `/auth/disable-account` | `password`, `code` when two-factor is enabled |
| `/auth/two-factor/setup` | `password` |
| `/auth/two-factor/enable`, `/auth/two-factor/verify` | `code` |
| `/auth/two-factor/disable` | `password`, `code` |
| `/onboarding/name` | `name` |
| `/onboarding/project` | `name`, `productType`, `brief`, `pages` |
| `/onboarding/design` | `strategy` |

`GET /project` returns the owned active project. `PUT /project` accepts `{ project, version }` and returns the canonical `{ project, version }`; clients must adopt both because immutable token snapshots may receive a new version. Stale writes return 409. Project changes and direction snapshots commit atomically.

## Verification and boundaries

`pnpm test:api` uses a random schema in a loopback `clayface_dev` or `clayface_test` database, runs both migrations, and removes only that schema afterwards. `pnpm test:e2e` exercises the web proxy, onboarding, durable edits, password reset, and recovery-code sign-in; start and migrate the development database first.

Existing production accounts have not been migrated. OAuth/provider login, an account migration ledger, email verification, background cleanup of expired auth rows, and deployment operations remain separate work. Follow `docs/REBUILD-AUDIT.md` before any legacy cutover. Account disabling is exposed by the API; the account settings UI currently offers password and two-factor controls.
