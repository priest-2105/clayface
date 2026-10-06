# Server foundation

The Fastify service in `apps/api` uses PostgreSQL through `pg` and explicit SQL transactions. Migrations are applied once under an advisory lock and recorded in `clayface_migrations`. Drizzle and the background worker are not connected.

## Implemented persistence

- UUID accounts with a separate legacy identity field, session hashes, password-reset hashes, encrypted authenticator secrets, recovery-code hashes, and durable attempt limits.
- One active project per user, enforced by a partial unique index. Onboarding saves name and project details before atomically creating the initial design-system snapshot and direction.
- Owned workspace reads and full-document saves. Saves check `project_version` under a row lock and return 409 for stale writes. The service validates IR, unique direction identities, at most three directions, and design-system pins.
- Immutable design-system snapshots. Undo may reuse an identical historical snapshot; different tokens at an existing version receive a fresh version. The returned project includes updated pins.
- Direction rows stay synchronized with workspace JSON, including name and strategy; removed directions become archived. Project name, product type, brief, and design-system name stay synchronized with their relational records.

`direction_version` is incremented on saves, but concurrency is currently enforced at the whole-project level. There is no standalone direction-edit endpoint or activity-record write. The database-neutral in-memory adapter in `packages/persistence` remains a contract test fixture.

## Remaining boundaries

Asset and generation-job tables reserve future storage; upload APIs, worker execution, hosted previews, Figma import, and Next.js export are not implemented. Existing accounts and projects require the backup, restore, identity mapping, and archive reconciliation in [REBUILD-AUDIT.md](REBUILD-AUDIT.md) before cutover. Metadata-only legacy designs are not editable IR.
