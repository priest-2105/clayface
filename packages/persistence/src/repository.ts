import { projectSchema, type Project } from '@clayface/schema';
import { validatePersistedDocument } from './index';
import type { DirectionRecord, ProjectRecord, ProductType } from './schema';

export type ProjectAggregate = {
  record: ProjectRecord;
  document: Project;
  directionVersions: Record<string, number>;
};

export class ProjectNotFoundError extends Error {
  constructor() { super('Project not found.'); }
}

export class ProjectConflictError extends Error {
  readonly currentVersion: number;
  constructor(currentVersion: number) {
    super('This direction changed elsewhere. Reload before saving again.');
    this.currentVersion = currentVersion;
  }
}

function productTypeForPersistence(productType: Project['productType']): ProductType {
  if (productType === 'Agency / studio') return 'AGENCY_STUDIO';
  if (productType === 'Service business') return 'SERVICE_BUSINESS';
  return 'SOFTWARE_SAAS';
}

function clone<T>(value: T): T { return structuredClone(value); }

export class InMemoryProjectRepository {
  private readonly projects = new Map<string, ProjectAggregate>();

  createProject(userId: string, input: Project): ProjectAggregate {
    const existing = [...this.projects.values()].some(item => item.record.userId === userId && item.record.status === 'ACTIVE');
    if (existing) throw new Error('A user can have only one active project.');
    const validated = validatePersistedDocument(projectSchema.parse(input), input.designSystem.id, input.designSystem.version);
    const record: ProjectRecord = {
      id: validated.id,
      userId,
      legacyProjectId: null,
      name: validated.name,
      productType: productTypeForPersistence(validated.productType),
      brief: validated.brief,
      status: 'ACTIVE',
      projectVersion: 1,
    };
    const aggregate: ProjectAggregate = {
      record,
      document: validated,
      directionVersions: Object.fromEntries(validated.directions.map(direction => [direction.id, 1])),
    };
    this.projects.set(`${userId}:${validated.id}`, aggregate);
    return clone(aggregate);
  }

  getProject(userId: string, projectId: string): ProjectAggregate {
    const aggregate = this.projects.get(`${userId}:${projectId}`);
    if (!aggregate || aggregate.record.status !== 'ACTIVE') throw new ProjectNotFoundError();
    return clone(aggregate);
  }

  updateDirection(userId: string, projectId: string, directionId: string, expectedVersion: number, document: Project['directions'][number]['document']): ProjectAggregate {
    const key = `${userId}:${projectId}`;
    const aggregate = this.projects.get(key);
    if (!aggregate || aggregate.record.status !== 'ACTIVE') throw new ProjectNotFoundError();
    const currentVersion = aggregate.directionVersions[directionId];
    if (!currentVersion) throw new ProjectNotFoundError();
    if (currentVersion !== expectedVersion) throw new ProjectConflictError(currentVersion);
    const next = clone(aggregate.document);
    const direction = next.directions.find(item => item.id === directionId);
    if (!direction) throw new ProjectNotFoundError();
    direction.document = clone(document);
    const validated = validatePersistedDocument(next, next.designSystem.id, next.designSystem.version);
    const updated: ProjectAggregate = {
      record: { ...aggregate.record, projectVersion: aggregate.record.projectVersion + 1 },
      document: validated,
      directionVersions: { ...aggregate.directionVersions, [directionId]: currentVersion + 1 },
    };
    this.projects.set(key, updated);
    return clone(updated);
  }
}

export function directionRecordFromAggregate(aggregate: ProjectAggregate, directionId: string): Pick<DirectionRecord, 'id' | 'projectId' | 'status' | 'directionVersion'> {
  const direction = aggregate.document.directions.find(item => item.id === directionId);
  if (!direction) throw new ProjectNotFoundError();
  return { id: direction.id, projectId: aggregate.record.id, status: 'READY', directionVersion: aggregate.directionVersions[direction.id] };
}
