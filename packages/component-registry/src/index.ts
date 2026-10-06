import { documentSchema, type ClayfaceDocument, type ClayfaceNode, type ComponentId, type ContentKey } from '@clayface/schema';

export type RegistryEntry = {
  id: ComponentId; name: string; category: string; description: string;
  version: '1.0.0'; variants: { id: string; label: string }[];
  fields: { key: ContentKey; label: string; multiline?: boolean }[];
};
const textFields: RegistryEntry['fields'] = [{ key: 'title', label: 'Heading' }, { key: 'body', label: 'Description', multiline: true }];
export const registry: RegistryEntry[] = [
  { id: 'layout.page', name: 'Page', category: 'Layout', description: 'A responsive page with ordered sections.', version: '1.0.0', variants: [{ id: 'default', label: 'Default' }], fields: [] },
  { id: 'navigation', name: 'Navigation', category: 'Navigation', description: 'Brand, page links, and a primary action.', version: '1.0.0', variants: [{ id: 'simple', label: 'Simple' }, { id: 'centered', label: 'Centered' }], fields: [{ key: 'brand', label: 'Brand name' }, { key: 'action', label: 'Action label' }] },
  { id: 'hero', name: 'Hero', category: 'Marketing', description: 'An opening message with a product preview.', version: '1.0.0', variants: [{ id: 'split', label: 'Split' }, { id: 'centered', label: 'Centered' }, { id: 'editorial', label: 'Editorial' }], fields: [...textFields, { key: 'action', label: 'Button label' }] },
  { id: 'features', name: 'Features', category: 'Marketing', description: 'Three benefits, with room for the details.', version: '1.0.0', variants: [{ id: 'columns', label: 'Columns' }, { id: 'list', label: 'List' }], fields: textFields },
  { id: 'statement', name: 'Statement', category: 'Content', description: 'A quiet moment for the product philosophy.', version: '1.0.0', variants: [{ id: 'inset', label: 'Inset' }, { id: 'wide', label: 'Wide' }], fields: textFields },
  { id: 'pricing', name: 'Pricing', category: 'Marketing', description: 'A readable comparison of sample plans.', version: '1.0.0', variants: [{ id: 'columns', label: 'Columns' }, { id: 'list', label: 'List' }], fields: textFields },
  { id: 'contact', name: 'Contact', category: 'Forms', description: 'A contact form layout with labeled fields.', version: '1.0.0', variants: [{ id: 'split', label: 'Split' }, { id: 'centered', label: 'Centered' }], fields: textFields },
  { id: 'cta', name: 'Call to action', category: 'Marketing', description: 'A clear next step at the end of the page.', version: '1.0.0', variants: [{ id: 'band', label: 'Band' }, { id: 'centered', label: 'Centered' }], fields: [...textFields, { key: 'action', label: 'Button label' }] },
  { id: 'footer', name: 'Footer', category: 'Navigation', description: 'Brand details and the supporting page links.', version: '1.0.0', variants: [{ id: 'simple', label: 'Simple' }, { id: 'columns', label: 'Columns' }], fields: [{ key: 'brand', label: 'Brand name' }, { key: 'body', label: 'Description', multiline: true }] },
];
export function getComponent(id: ComponentId) {
  const entry = registry.find(component => component.id === id);
  if (!entry) throw new Error(`Unknown component: ${id}`);
  return entry;
}

export function validateDocument(input: unknown): ClayfaceDocument {
  const document = documentSchema.parse(input);
  const ids = new Set<string>();
  const pageRoutes = new Set<string>();
  const validateNode = (node: ClayfaceNode, isRoot: boolean) => {
    if (ids.has(node.id)) throw new Error('Each section must have a unique ID.');
    ids.add(node.id);
    const component = getComponent(node.componentId);
    if (!component.variants.some(variant => variant.id === node.variant)) throw new Error(`Unsupported ${component.name} variant.`);
    if (isRoot && node.componentId !== 'layout.page') throw new Error('Pages must use the page layout root.');
    if (!isRoot && (node.componentId === 'layout.page' || node.children.length)) throw new Error('This version supports sections directly within a page.');
    if (node.componentId === 'layout.page') {
      if (node.children[0]?.componentId !== 'navigation' || node.children.at(-1)?.componentId !== 'footer') throw new Error('Keep navigation first and footer last.');
      if (node.children.filter(child => child.componentId === 'hero').length !== 1) throw new Error('Each page needs one opening hero.');
    }
    for (const child of node.children) validateNode(child, false);
  };
  for (const page of document.pages) {
    if (ids.has(page.id) || pageRoutes.has(page.route)) throw new Error('Pages must have unique IDs and routes.');
    ids.add(page.id); pageRoutes.add(page.route);
    validateNode(page.root, true);
  }
  return document;
}
