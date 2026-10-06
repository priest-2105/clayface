import { projectSchema, type Project } from '@clayface/schema';
import type { DirectionRecord, ProjectRecord, ProjectStatus } from './schema';

export * from './schema';
export * from './repository';

export const MAX_ACTIVE_DIRECTIONS = 3;
export const ACTIVE_DIRECTION_STATUSES = ['DRAFT', 'GENERATING', 'READY', 'FAILED'] as const;

export function assertSingleProject(projects: Pick<ProjectRecord, 'userId' | 'status'>[]) {
  const active = projects.filter(item => item.status === 'ACTIVE');
  if (active.length > 1) throw new Error('A user can have only one active project.');
}

export function assertDirectionCapacity(directions: Pick<DirectionRecord, 'id' | 'status'>[], replacingDirectionId?: string) {
  const activeCount = directions.filter(item => ACTIVE_DIRECTION_STATUSES.includes(item.status as (typeof ACTIVE_DIRECTION_STATUSES)[number]) && item.id !== replacingDirectionId).length;
  if (activeCount >= MAX_ACTIVE_DIRECTIONS) throw new Error('This project already has three active design directions.');
}

export function validatePersistedDocument(document: unknown, designSystemId: string, designSystemVersion: number): Project {
  const projectDocument = projectSchema.parse(document);
  for (const directionDocument of projectDocument.directions) {
    if (directionDocument.document.designSystemId !== designSystemId || directionDocument.document.designSystemVersion !== designSystemVersion) throw new Error('Direction document is pinned to a different design-system version.');
  }
  return projectDocument;
}

export function projectOwnerWhere(userId: string, projectId: string): { userId: string; projectId: string; status: ProjectStatus } {
  return { userId, projectId, status: 'ACTIVE' };
}

export function optimisticProjectWhere(userId: string, projectId: string, version: number) {
  return { ...projectOwnerWhere(userId, projectId), projectVersion: version };
}

export const archivedProjectWhere = (userId: string) => ({ userId, status: 'ARCHIVED' as const });
