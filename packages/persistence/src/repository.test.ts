import { describe, expect, it } from 'vitest';
import { createSampleProject } from '@clayface/registry/fixtures';
import { InMemoryProjectRepository, ProjectConflictError, ProjectNotFoundError, directionRecordFromAggregate } from './repository';

describe('project repository contract', () => {
  it('keeps ownership and the one-active-project rule', () => {
    const repository = new InMemoryProjectRepository();
    const project = createSampleProject();
    repository.createProject('user-a', project);
    expect(() => repository.createProject('user-a', { ...project, id: 'second' })).toThrow('one active project');
    expect(() => repository.getProject('user-b', project.id)).toThrow(ProjectNotFoundError);
    expect(repository.getProject('user-a', project.id).document.id).toBe(project.id);
  });

  it('requires the current direction version before applying a document', () => {
    const repository = new InMemoryProjectRepository();
    const project = createSampleProject();
    repository.createProject('user-a', project);
    const direction = project.directions[0];
    const changed = structuredClone(direction.document);
    changed.pages[0].root.children[1].props.title = 'Updated title';
    const saved = repository.updateDirection('user-a', project.id, direction.id, 1, changed);
    expect(directionRecordFromAggregate(saved, direction.id).directionVersion).toBe(2);
    expect(saved.record.projectVersion).toBe(2);
    expect(() => repository.updateDirection('user-a', project.id, direction.id, 1, changed)).toThrow(ProjectConflictError);
  });
});
