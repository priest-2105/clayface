# Clayface

A design-system-driven UI workspace with password accounts, optional two-factor authentication, guided onboarding, and PostgreSQL-backed project saves.

## Run locally

Requires Node 22+, pnpm 10.17.1, and PostgreSQL 17. Copy `.env.example` to `.env`, configure a local database and encryption key, then follow [API setup](apps/api/README.md).

```sh
pnpm install
pnpm db:migrate
pnpm dev
```

Open http://127.0.0.1:3000. `pnpm dev` starts the web app and API. The configured local PostgreSQL service must be running; this workspace's existing isolated cluster can be started with `pnpm db:start`.

Run commands from the repository root. To run services separately, use `pnpm dev:api` in one terminal and `pnpm dev:web` in another. `http://localhost:3000` also works in development; stay on one hostname to keep the same session cookie.

## Application routes

| Area | Routes | Access |
| --- | --- | --- |
| Public website | `/`, `/product`, `/help` | No account or API connection required |
| Authentication | `/signin`, `/signup`, `/forgot-password`, `/reset-password` | Sign-in and account recovery |
| Setup | `/onboarding` | Signed-in users with incomplete setup |
| Dashboard | `/dashboard`, `/dashboard/preview`, `/dashboard/account` | Signed in and onboarding complete |

The `(public)` and `(auth)` folders organize the Next.js source without changing URLs. The dashboard layout gates its children and connects the owned workspace; the API checks authentication and ownership independently. Completed accounts visiting sign-in or signup go to the dashboard. Incomplete accounts resume onboarding. `/account` and `/preview` redirect to their dashboard equivalents. Editor subviews use `/dashboard#directions`, `/dashboard#design-system`, and related hashes.

## What works

- Sample marketing website with five page families and up to three composition directions.
- Shared registry and IR renderer used by the isolated canvas and full preview.
- Section selection, content and variant editing, constrained reordering, local undo/redo.
- Project design-system color, typography, shape and spacing controls.
- Direction creation/deletion, project setup, component search and asset empty state.
- Validated account-owned persistence, optimistic save conflicts, immutable token snapshots, and JSON download.
- Signup, sign-in, sign-out, password reset/change, authenticator setup, and one-use recovery codes.
- Resumable name/project/design onboarding and account settings.
- Desktop workspace, collapsible navigation, mobile navigation and inspector access.

Generated content is illustrative. The JSON download is a workspace backup, not a Next.js code export. Undo history lasts for the current session. Account data persists across reloads and devices; concurrent stale saves show a conflict and require reload rather than silently overwriting work. Treat downloaded JSON as a backup; a JSON restore/import interface is not yet included.

## Boundaries

| Location | Responsibility |
| --- | --- |
| apps/web | Account UI, onboarding, authenticated workspace and preview |
| packages/clayface-schema | Serializable v1 contracts and syntactic validation |
| packages/component-registry | Versioned component metadata, semantic validation and fixtures |
| packages/component-library | Rendered components and isolated preview CSS |
| packages/editor | Transactional sample operations, browser storage and history |
| packages/generator | Deterministic page planning and validated IR generation |
| packages/auth | Migration-safe account normalization, session invalidation and credential contracts |
| packages/design-tokens | Clayface product chrome tokens |
| packages/persistence | Database-neutral records, invariants and PostgreSQL migration contract |
| apps/api | Fastify auth, onboarding and PostgreSQL workspace persistence |
| apps/worker | Reserved boundary for future background jobs |

The schema is deliberately provisional: it represents bounded, flat page sections. Do not freeze IR v1 or claim arbitrary nested component coverage until the spec's Gate 2 fixtures and migration tests pass. Design-system edits update all directions explicitly and persist immutable snapshots.

## Verification

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm test:api
pnpm build
pnpm test:e2e
```

API tests use a disposable schema in a local `clayface_dev` or `clayface_test` database. Browser tests use installed Google Chrome, start the web and API servers if needed, and write screenshots under `.impeccable/review/`. Start and migrate the development database first. Playwright traces for failed runs are in `test-results/`.

## Existing data

The old working-tree deletion predates this rebuild. No production database was opened or modified. See `docs/REBUILD-AUDIT.md` for the selective reuse assessment and required backup/migration sequence.

## Current boundary

The deterministic generator produces validated IR from a brief, product type, page list, strategy and design-system pin; see [docs/GENERATION-FOUNDATION.md](docs/GENERATION-FOUNDATION.md). The live local API and persistence boundaries are documented in [docs/SERVER-FOUNDATION.md](docs/SERVER-FOUNDATION.md).

Authentication behavior is documented in [docs/AUTH-FOUNDATION.md](docs/AUTH-FOUNDATION.md). The service uses `pg` directly; Drizzle, OAuth/provider login, and the legacy account migration ledger remain unimplemented. Production cutover still requires the rebuild audit. Supported Figma mapping, hosted previews, and Next.js export are later milestones. AI remains optional.

Framework setup follows the installed Next.js and Turborepo guides. Accessible dialogs use React Aria Components. Geist is self-hosted; its license accompanies the preview font in `apps/web/public/fonts/OFL.txt`.

## Next product priority

The next major product surface is a public **status page** for Clayface. It will communicate current service health, active incidents, scheduled maintenance, and incident history, remaining available when the main application is unavailable. It should consume safe health signals from the API without exposing database or infrastructure details.
