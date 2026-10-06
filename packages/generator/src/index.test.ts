import { describe, expect, it } from 'vitest';
import { generateDirection, planPages } from './index';

const input = {
  brand: 'Northstar',
  brief: 'A calm workspace for independent teams.',
  productType: 'Software / SaaS' as const,
  pages: ['Home', 'Features', 'Contact'],
  strategy: 'product' as const,
  designSystemId: 'system-northstar',
  designSystemVersion: 1,
};

describe('deterministic generation', () => {
  it('plans bounded page intents with stable routes', () => {
    expect(planPages(['Home', 'Features', 'home', 'A long page'])).toEqual([
      { name: 'Home', route: '/', purpose: 'opening', requiredComponents: ['navigation', 'hero', 'features', 'cta', 'footer'] },
      { name: 'Features', route: '/features', purpose: 'proof', requiredComponents: ['navigation', 'hero', 'features', 'cta', 'footer'] },
      { name: 'A long page', route: '/a-long-page', purpose: 'proof', requiredComponents: ['navigation', 'hero', 'features', 'cta', 'footer'] },
    ]);
  });

  it('returns the same validated IR for the same input', () => {
    const first = generateDirection(input);
    const second = generateDirection(input);
    expect(first).toEqual(second);
    expect(first.direction.document.designSystemId).toBe('system-northstar');
    expect(first.direction.document.pages[0].root.children.find(node => node.componentId === 'hero')?.props.body).toBe(input.brief);
  });

  it('bounds pages and reports the truncation', () => {
    const result = generateDirection({ ...input, pages: ['Home', 'One', 'Two', 'Three', 'Four', 'Five'] });
    expect(result.direction.document.pages).toHaveLength(5);
    expect(result.warnings).toContain('Only the first five requested pages were included in this direction.');
  });
});
