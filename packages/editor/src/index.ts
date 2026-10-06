import { create } from 'zustand';
import { projectSchema, findNode, type Project, type EditorOperation, type DesignSystem, type Strategy } from '@clayface/schema';
import { getComponent, validateDocument } from '@clayface/registry';
import { createSampleProject } from '@clayface/registry/fixtures';
import { generateDirection } from '@clayface/generator';

export const STORAGE_KEY = 'clayface:workspace:v1';
const MAX_HISTORY = 50;
type RemoteConnection = {
  save: (project: Project) => Promise<Project>;
  pending: Project | null;
  saved: Project;
  saving: boolean;
  conflict: boolean;
};
let remote: RemoteConnection | null = null;
export function connectWorkspace(project: Project, save: (project: Project) => Promise<Project>) {
  const validated = validateProject(project);
  remote = { save, pending: null, saved: validated, saving: false, conflict: false };
  useWorkspace.setState({ project: validated, directionId: validated.directions[0]?.id ?? '', pageRoute: '/', selectedId: null, history: [], future: [], hydrated: true, storageError: null, error: null, saveStatus: 'saved' });
}
export function disconnectWorkspace() { remote = null; }
async function flushRemote(connection: RemoteConnection) {
  if (connection.saving || connection.conflict) return;
  connection.saving = true;
  try {
    while (connection.pending) {
      const snapshot = connection.pending; connection.pending = null;
      const saved = await connection.save(snapshot);
      connection.saved = saved;
      if (connection.pending === snapshot) connection.pending = null;
      if (remote !== connection) continue;
      if (useWorkspace.getState().project === snapshot) useWorkspace.setState({ project: saved });
      useWorkspace.setState({ saveStatus: connection.pending ? 'saving' : 'saved', error: null });
    }
  } catch (error) {
    connection.conflict = Boolean(error && typeof error === 'object' && 'status' in error && error.status === 409);
    if (remote === connection) {
      connection.pending = useWorkspace.getState().project;
      useWorkspace.setState({ saveStatus: 'error', error: error instanceof Error ? error.message : 'Your work could not be saved. Please retry.' });
    }
  } finally { connection.saving = false; }
}
function activeSelection(project: Project, directionId: string, pageRoute: string) {
  const direction = project.directions.find(item => item.id === directionId) ?? project.directions[0];
  return { directionId: direction?.id ?? '', pageRoute: direction?.document.pages.find(page => page.route === pageRoute)?.route ?? direction?.document.pages[0]?.route ?? '/' };
}
export function validateProject(input: unknown): Project {
  const project = projectSchema.parse(input);
  const ids = new Set<string>();
  for (const direction of project.directions) {
    if (ids.has(direction.id)) throw new Error('Duplicate direction ID.');
    ids.add(direction.id);
    validateDocument(direction.document);
    if (direction.document.designSystemId !== project.designSystem.id || direction.document.designSystemVersion !== project.designSystem.version) throw new Error('The direction needs its matching design system.');
  }
  return project;
}

export function applyOperation(project: Project, directionId: string, operation: EditorOperation): Project {
  const next = structuredClone(project);
  const direction = next.directions.find(item => item.id === directionId);
  if (!direction) throw new Error('Choose a direction first.');
  const node = findNode(direction.document, operation.nodeId);
  if (!node) throw new Error('This section could not be found.');
  if (operation.type === 'setContent') {
    if (!getComponent(node.componentId).fields.some(field => field.key === operation.key)) throw new Error('This property is not editable.');
    node.props[operation.key] = operation.value;
  }
  if (operation.type === 'setVariant') node.variant = operation.value;
  if (operation.type === 'moveNode') {
    const page = direction.document.pages.find(item => item.id === operation.pageId);
    if (!page) throw new Error('This page could not be found.');
    const index = page.root.children.findIndex(item => item.id === node.id);
    const target = index + operation.offset;
    if (index <= 0 || index >= page.root.children.length - 1 || target <= 0 || target >= page.root.children.length - 1) throw new Error('Navigation and footer stay at the edges of the page.');
    page.root.children.splice(index, 1);
    page.root.children.splice(target, 0, node);
  }
  return validateProject(next);
}

type WorkspaceState = {
  project: Project; directionId: string; pageRoute: string; selectedId: string | null;
  hydrated: boolean; storageError: string | null; error: string | null;
  history: Project[]; future: Project[]; saveStatus: 'saved' | 'saving' | 'error';
  hydrate: () => void; save: () => void; recover: () => void;
  selectDirection: (id: string) => void; selectPage: (route: string) => void; selectNode: (id: string | null) => void;
  edit: (operation: EditorOperation) => void; undo: () => void; redo: () => void;
  updateSystem: (updates: Partial<DesignSystem>) => void;
  addDirection: (strategy: Strategy) => void; deleteDirection: (id: string) => void;
  setupProject: (name: string, productType: Project['productType'], brief: string, pages: string[]) => void;
  clearError: () => void;
};

const initialProject = createSampleProject();
export const useWorkspace = create<WorkspaceState>((set, get) => {
  const commit = (project: Project) => {
    const state = get();
    if (state.storageError) { set({ error: 'Recover the saved workspace before editing.' }); return; }
    try {
      const validated = validateProject(project);
      set({ project: validated, history: [...state.history, state.project].slice(-MAX_HISTORY), future: [], error: null, saveStatus: 'saving' });
      get().save();
    } catch (error) { set({ error: error instanceof Error ? error.message : 'The change could not be applied.' }); }
  };
  return {
    project: initialProject, directionId: initialProject.directions[0].id, pageRoute: '/', selectedId: 'product-home-hero',
    hydrated: false, storageError: null, error: null, history: [], future: [], saveStatus: 'saved',
    hydrate: () => {
      if (get().hydrated) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = JSON.parse(raw);
          const project = validateProject(stored.project);
          const direction = project.directions.find(item => item.id === stored.directionId) ?? project.directions[0];
          const pageRoute = direction?.document.pages.some(page => page.route === stored.pageRoute) ? stored.pageRoute : direction?.document.pages[0]?.route ?? '/';
          set({ project, directionId: direction?.id ?? '', pageRoute, selectedId: null });
        }
        set({ hydrated: true });
        get().save();
      } catch {
        set({ hydrated: true, storageError: 'Your saved workspace could not be read. Download a backup before starting again.', saveStatus: 'error' });
      }
    },
    save: () => {
      const state = get();
      if (!state.hydrated || state.storageError) return;
      if (remote) { if (state.project === remote.saved && !remote.pending) return; remote.pending = state.project; if (!remote.conflict) { set({ saveStatus: 'saving' }); void flushRemote(remote); } return; }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ project: state.project, directionId: state.directionId, pageRoute: state.pageRoute }));
        set({ saveStatus: 'saved' });
      } catch { set({ saveStatus: 'error', error: 'This browser could not save your changes. Free some storage, then retry. Your current work is still open.' }); }
    },
    recover: () => { const project = createSampleProject(); set({ project, directionId: project.directions[0].id, pageRoute: '/', selectedId: null, history: [], future: [], storageError: null, error: null }); get().save(); },
    selectDirection: id => { const direction = get().project.directions.find(item => item.id === id); if (!direction) return; set({ directionId: id, pageRoute: direction.document.pages.some(page => page.route === get().pageRoute) ? get().pageRoute : direction.document.pages[0].route, selectedId: null }); get().save(); },
    selectPage: route => { set({ pageRoute: route, selectedId: null }); get().save(); },
    selectNode: id => set({ selectedId: id }),
    edit: operation => { try { commit(applyOperation(get().project, get().directionId, operation)); } catch (error) { set({ error: error instanceof Error ? error.message : 'The change could not be applied.' }); } },
    undo: () => { const state = get(); const previous = state.history.at(-1); if (!previous) return; set({ project: previous, ...activeSelection(previous, state.directionId, state.pageRoute), history: state.history.slice(0, -1), future: [state.project, ...state.future], selectedId: null }); get().save(); },
    redo: () => { const state = get(); const next = state.future[0]; if (!next) return; set({ project: next, ...activeSelection(next, state.directionId, state.pageRoute), history: [...state.history, state.project].slice(-MAX_HISTORY), future: state.future.slice(1), selectedId: null }); get().save(); },
    updateSystem: updates => { const project = structuredClone(get().project); project.designSystem = { ...project.designSystem, ...updates, id: project.designSystem.id, version: project.designSystem.version + 1 }; for (const direction of project.directions) direction.document.designSystemVersion = project.designSystem.version; commit(project); },
    addDirection: strategy => { const project = structuredClone(get().project); if (project.directions.length >= 3) { set({ error: 'All three direction slots are in use. Delete one to make room.' }); return; } if (project.directions.some(item => item.strategy === strategy)) { set({ error: 'This direction strategy already exists.' }); return; } const generated = generateDirection({ brand: project.name, brief: project.brief, productType: project.productType, pages: project.directions[0]?.document.pages.map(page => page.name) ?? ['Home'], strategy, designSystemId: project.designSystem.id, designSystemVersion: project.designSystem.version }); project.directions.push(generated.direction); commit(project); get().selectDirection(generated.direction.id); },
    deleteDirection: id => { const project = structuredClone(get().project); project.directions = project.directions.filter(item => item.id !== id); commit(project); if (get().directionId === id) set({ directionId: project.directions[0]?.id ?? '', pageRoute: project.directions[0]?.document.pages[0]?.route ?? '/', selectedId: null }); get().save(); },
    setupProject: (name, productType, brief, pages) => { const project = createSampleProject(); project.name = name; project.productType = productType; project.brief = brief; project.designSystem.name = `${name} foundations`; const generated = generateDirection({ brand: name, brief, productType, pages, strategy: 'product', designSystemId: project.designSystem.id, designSystemVersion: project.designSystem.version }); project.directions = [generated.direction]; commit(project); set({ directionId: project.directions[0].id, pageRoute: project.directions[0].document.pages[0].route, selectedId: null }); get().save(); },
    clearError: () => set({ error: null }),
  };
});
