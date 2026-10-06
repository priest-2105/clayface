# Rebuild audit and preservation plan

Baseline: 9efa234 (Refine workspace visual hierarchy). At the start of this milestone all prior app files were already deleted from the working tree. Git history remains the read-only reference.

| Area | Evidence | Decision |
| --- | --- | --- |
| Application | Next.js 16, React 19, single app | Keep framework; move the product into apps/web with package boundaries. |
| UI primitives | Old Button uses video textures, random fracture geometry, custom effects | Replace chrome with compact accessible controls matching Visual System v1. |
| Utilities | lib/utils.ts provides clsx + tailwind-merge | Port the small class-name helper with source attribution. |
| Authentication | NextAuth, bcrypt hashes, Google subjects, authVersion and disabledAt | Preserve identities and security behavior; port after account mapping is verified. Do not silently reset passwords. |
| Project API | Creates multiple projects and automatic chat messages | Replace with one-active-project resources; no automatic chat workspace. |
| Designs | ProjectDesign has metadata/preview links but no IR | Back up and hide these records; never label them as editable new directions. |
| Persistence | Prisma/PostgreSQL; project/chat/reference/activity relations | New Drizzle schema after verified inventory/backup; old database remains untouched now. |
| Figma | REST OAuth tokens in encrypted cookies; URL parsing | Reuse parsing ideas with host validation; connection code is reference, not a completed MCP importer. |
| Generation | Examined project flow creates metadata and starter messages | Build the deterministic pipeline against shared contracts in a later slice. |

## Migration sequence (required before production cutover)

1. Inventory row counts, foreign keys, auth providers, existing backups, and deployed schema. No credentials or user data in repository fixtures.
2. Take an encrypted database backup and prove restoration into an isolated database. Keep source IDs and checksums in a migration ledger.
3. Copy accounts preserving identity/provider subjects, disable flags and session invalidation semantics. Verify bcrypt credential compatibility or an explicit credential migration before rollout.
4. Pick the most recently opened non-archived project for each user, then updatedAt and id as deterministic tie breakers. Keep extras as read-only legacy archives. If all were archived, leave them archived and allow one new project.
5. Preserve old chats, references and design metadata in the backup/legacy schema. Legacy design rows remain hidden in the new UI as requested. Only valid IR populates new directions.
6. Reconcile counts and ownership; test account access and archives; switch traffic only after verification. Retain source data for rollback. Do not drop old tables as part of this milestone.

## Current milestone

The local Fastify API now connects to an isolated development PostgreSQL database for password accounts, two-factor authentication, onboarding, and durable workspace saves. Integration tests use disposable schemas; browser tests create and remove synthetic accounts. The legacy production database remains untouched: no production backup, restore, account migration, credential cutover, or provider migration has been performed. The worker remains unimplemented. See `apps/api/README.md` for setup and service boundaries.
