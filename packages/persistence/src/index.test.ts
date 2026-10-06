import { describe, expect, it } from 'vitest';
import { assertDirectionCapacity, assertSingleProject, MAX_ACTIVE_DIRECTIONS, validatePersistedDocument } from './index';
import { createSampleProject } from '@clayface/registry/fixtures';

describe('persistence invariants', () => {
  it('keeps one active project per user', () => {
    expect(() => assertSingleProject([{ userId: 'u', status: 'ACTIVE' }, { userId: 'u', status: 'ACTIVE' }])).toThrow('one active project');
    expect(() => assertSingleProject([{ userId: 'u', status: 'ACTIVE' }, { userId: 'u', status: 'ARCHIVED' }])).not.toThrow();
  });
  it('enforces the three-direction limit for active work', () => {
    const directions = Array.from({ length: MAX_ACTIVE_DIRECTIONS }, () => ({ id: crypto.randomUUID(), status: 'READY' as const }));
    expect(() => assertDirectionCapacity(directions)).toThrow('three active');
    expect(() => assertDirectionCapacity(directions, directions[0].id)).not.toThrow();
  });
  it('requires direction documents to reference the activated system version', () => {
    const sample = createSampleProject();
    expect(validatePersistedDocument({ ...sample, directions: [sample.directions[0]] }, sample.designSystem.id, 1).directions).toHaveLength(1);
    expect(() => validatePersistedDocument(sample, sample.designSystem.id, 2)).toThrow('pinned');
  });
});
