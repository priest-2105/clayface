import { beforeEach, describe, expect, it, vi } from 'vitest';
import { findNode } from '@clayface/schema';
import { createDirection, createSampleProject } from '@clayface/registry/fixtures';
import { validateDocument } from '@clayface/registry';
import { applyOperation, STORAGE_KEY, useWorkspace, validateProject } from './index';

describe('versioned sample documents', () => {
  it('accepts all three composition strategies across the five page families', () => {
    for (const strategy of ['product', 'editorial', 'minimal'] as const) expect(validateDocument(createDirection(strategy).document).pages).toHaveLength(5);
  });
  it('rejects unknown variants and duplicate node IDs', () => {
    const document = createDirection('product').document;
    document.pages[0].root.children[1].variant = 'arbitrary-css';
    expect(() => validateDocument(document)).toThrow('Unsupported Hero variant');
    document.pages[0].root.children[1].variant = 'split';
    document.pages[0].root.children[2].id = document.pages[0].root.children[1].id;
    expect(() => validateDocument(document)).toThrow('unique ID');
  });
  it('keeps operations atomic when a change is invalid', () => {
    const project = createSampleProject();
    const original = structuredClone(project);
    expect(() => applyOperation(project, 'direction-product', { type: 'setVariant', nodeId: 'product-home-hero', value: 'invalid' })).toThrow();
    expect(project).toEqual(original);
  });
  it('edits one node without changing its identity or sibling direction', () => {
    const project = createSampleProject();
    const updated = applyOperation(project, 'direction-product', { type: 'setContent', nodeId: 'product-home-hero', key: 'title', value: 'A calmer way to work.' });
    expect(findNode(updated.directions[0].document, 'product-home-hero')?.props.title).toBe('A calmer way to work.');
    expect(updated.directions[1]).toEqual(project.directions[1]);
    expect(project.directions[0]).not.toEqual(updated.directions[0]);
  });
  it('rejects version mismatches and more than three directions', () => {
    const project = createSampleProject();
    project.directions[0].document.designSystemVersion = 2;
    expect(() => validateProject(project)).toThrow('matching design system');
    project.directions[0].document.designSystemVersion = 1;
    project.directions.push(createDirection('minimal'), createDirection('minimal'));
    expect(() => validateProject(project)).toThrow();
  });
  it('permits section reordering while keeping navigation and footer fixed', () => {
    const project = createSampleProject();
    const moved = applyOperation(project, 'direction-product', { type: 'moveNode', pageId: 'product-page-home', nodeId: 'product-home-features', offset: 1 });
    expect(moved.directions[0].document.pages[0].root.children[3].id).toBe('product-home-features');
    expect(() => applyOperation(project, 'direction-product', { type: 'moveNode', pageId: 'product-page-home', nodeId: 'product-home-hero', offset: -1 })).toThrow('edges');
  });
});

describe('workspace recovery and history', () => {
  const storage = new Map<string, string>();
  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('localStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) });
    useWorkspace.setState({ project: createSampleProject(), directionId: 'direction-product', pageRoute: '/', selectedId: null, history: [], future: [], storageError: null, error: null, hydrated: false, saveStatus: 'saved' });
  });
  it('preserves unreadable saved data instead of overwriting it', () => {
    storage.set(STORAGE_KEY, '{invalid');
    useWorkspace.getState().hydrate();
    useWorkspace.getState().save();
    expect(useWorkspace.getState().storageError).toBeTruthy();
    expect(storage.get(STORAGE_KEY)).toBe('{invalid');
  });
  it('enforces direction capacity and restores an editable selection after undo', () => {
    useWorkspace.getState().hydrate();
    useWorkspace.getState().addDirection('minimal');
    useWorkspace.getState().addDirection('product');
    expect(useWorkspace.getState().project.directions).toHaveLength(3);
    for (const direction of [...useWorkspace.getState().project.directions]) useWorkspace.getState().deleteDirection(direction.id);
    expect(useWorkspace.getState().project.directions).toHaveLength(0);
    useWorkspace.getState().undo();
    expect(useWorkspace.getState().directionId).toBe('direction-minimal');
    useWorkspace.getState().redo();
    expect(useWorkspace.getState().directionId).toBe('');
  });
  it('updates the design-system reference consistently for every direction', () => {
    useWorkspace.getState().hydrate();
    useWorkspace.getState().updateSystem({ accent: '#965A42' });
    const project = useWorkspace.getState().project;
    expect(project.designSystem.version).toBe(2);
    expect(project.directions.every(direction => direction.document.designSystemVersion === 2)).toBe(true);
  });
});
