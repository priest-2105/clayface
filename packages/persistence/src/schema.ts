/**
 * Database-neutral table contract for the migration milestone.
 * The SQL migration is the executable PostgreSQL shape; a later Drizzle adapter
 * maps these exact columns and statuses once a database connection is approved.
 */
export const persistenceTables = [
  'app_user', 'project', 'design_system', 'design_system_version', 'direction', 'asset', 'generation_job',
] as const;
export type PersistenceTable = typeof persistenceTables[number];
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED';
export type DirectionStatus = 'DRAFT' | 'GENERATING' | 'READY' | 'FAILED' | 'ARCHIVED';
export type DirectionStrategy = 'PRODUCT' | 'EDITORIAL' | 'MINIMAL';
export type JobStatus = 'QUEUED' | 'RUNNING' | 'VALIDATING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type ProductType = 'SOFTWARE_SAAS' | 'AGENCY_STUDIO' | 'SERVICE_BUSINESS';

export type AppUser = { id: string; legacyUserId: string | null; email: string; name: string | null; passwordHash: string | null; authVersion: number; disabledAt: Date | null };
export type ProjectRecord = { id: string; userId: string; legacyProjectId: string | null; name: string; productType: ProductType; brief: string; status: ProjectStatus; projectVersion: number };
export type DirectionRecord = { id: string; projectId: string; designSystemVersionId: string; legacyDesignId: string | null; name: string; strategy: DirectionStrategy; status: DirectionStatus; schemaVersion: number; document: unknown; directionVersion: number };
export type DesignSystemVersionRecord = { id: string; designSystemId: string; version: number; tokens: unknown; source: string };
export type AssetRecord = { id: string; projectId: string; storageKey: string; mediaType: string; checksum: string; metadata: unknown };
export type GenerationJobRecord = { id: string; projectId: string; directionId: string | null; idempotencyKey: string; type: string; status: JobStatus; stage: string | null; errorCode: string | null; errorDetail: string | null };

export const projectColumns = ['id', 'user_id', 'legacy_project_id', 'name', 'product_type', 'brief', 'status', 'active_design_system_version_id', 'project_version', 'created_at', 'updated_at'] as const;
export const directionColumns = ['id', 'project_id', 'design_system_version_id', 'legacy_design_id', 'name', 'strategy', 'status', 'schema_version', 'document', 'source', 'direction_version', 'created_at', 'updated_at'] as const;
