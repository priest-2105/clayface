# Clayface storage model

Clayface uses shared component definitions and user-owned project data.

## What signup creates

`POST /api/auth/signup` creates one `app_user` row and one session row. It does not copy components into PostgreSQL.

During onboarding, Clayface creates or updates one active `project` row for that user. Completing design setup then creates the project's `design_system`, its first `design_system_version`, and one or more `direction` rows. The generated page documents are stored as JSONB because they are the user's editable project state.

The database enforces one active project per user. Sessions, password resets, recovery codes, assets, and generation jobs reference the user or project through foreign keys and are deleted or archived according to their ownership rules.

## What is shared

Component metadata, variants, field definitions, validation, and renderers live in the versioned `packages/component-registry` and `packages/component-library` packages. A user document stores only a component ID, version, variant, and props. It does not store a copy of the component implementation.

## Current duplication to watch

The current persistence boundary keeps `project.workspace_document` as a complete editable aggregate and also maintains normalized `direction` and design-system records. The production optimization is now in place: API reads rebuild the project from normalized direction and design-system rows, while the snapshot remains only as a compatibility and rollback field during this migration window. New saves treat direction rows as canonical.

## Efficiency plan

1. Keep the registry immutable and shared. Never create per-user component rows for standard components.
2. Store user-specific content, props, selected variants, and references to component/version IDs only.
3. Treat normalized direction rows as the canonical persisted documents, and use the project row only for lightweight summary fields and optimistic versioning.
4. Add JSONB size limits and measure document size before accepting saves.
5. Store assets by checksum and reuse an existing object when the same user or project uploads the same file.
6. Add indexes for active project ownership, direction lookup, and updated timestamps before adding background generation or status reporting.
