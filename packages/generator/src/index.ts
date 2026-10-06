import { validateDocument } from '@clayface/registry';
import { createDirection } from '@clayface/registry/fixtures';
import type { Direction, Project, Strategy } from '@clayface/schema';

export type GenerationInput = {
  brand: string;
  brief: string;
  productType: Project['productType'];
  pages: string[];
  strategy: Strategy;
  designSystemId: string;
  designSystemVersion: number;
};

export type PageIntent = {
  name: string;
  route: string;
  purpose: 'opening' | 'proof' | 'conversion' | 'context' | 'contact';
  requiredComponents: string[];
};

export type GenerationResult = {
  direction: Direction;
  plan: PageIntent[];
  warnings: string[];
};

const purposeByPage: Record<string, PageIntent['purpose']> = {
  home: 'opening',
  features: 'proof',
  pricing: 'conversion',
  about: 'context',
  contact: 'contact',
};

function clean(value: string, fallback: string, max: number) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return (normalized || fallback).slice(0, max);
}

function titleCase(value: string) {
  return clean(value, 'Your project', 80).replace(/\b\w/g, character => character.toUpperCase());
}

export function planPages(pages: string[]): PageIntent[] {
  const seenRoutes = new Set<string>();
  const names = pages.map(page => clean(page, 'Home', 80)).filter(name => {
    const route = name.toLowerCase() === 'home' ? '/' : `/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (seenRoutes.has(route)) return false;
    seenRoutes.add(route);
    return true;
  }).slice(0, 5);
  if (!names.length) names.push('Home');
  return names.map(name => {
    const key = name.toLowerCase();
    const purpose = purposeByPage[key] ?? 'proof';
    const requiredComponents = purpose === 'opening'
      ? ['navigation', 'hero', 'features', 'cta', 'footer']
      : purpose === 'contact'
        ? ['navigation', 'hero', 'contact', 'cta', 'footer']
        : ['navigation', 'hero', purpose === 'conversion' ? 'pricing' : 'features', 'cta', 'footer'];
    return { name, route: name === 'Home' ? '/' : `/${key.replace(/[^a-z0-9]+/g, '-')}`, purpose, requiredComponents };
  });
}

export function generateDirection(input: GenerationInput): GenerationResult {
  const brand = titleCase(input.brand);
  const plan = planPages(input.pages);
  const direction = createDirection(input.strategy, brand, plan.map(page => page.name));
  direction.document.designSystemId = input.designSystemId;
  direction.document.designSystemVersion = input.designSystemVersion;

  const brief = clean(input.brief, `A clear, useful ${input.productType.toLowerCase()} experience.`, 1000);
  for (const page of direction.document.pages) {
    const hero = page.root.children.find(node => node.componentId === 'hero');
    if (hero) {
      hero.props.body = brief;
      hero.props.brand = brand;
    }
    const navigation = page.root.children.find(node => node.componentId === 'navigation');
    if (navigation) navigation.props.brand = brand.toLowerCase();
    const footer = page.root.children.find(node => node.componentId === 'footer');
    if (footer) footer.props.brand = brand.toLowerCase();
  }

  validateDocument(direction.document);
  return {
    direction,
    plan,
    warnings: input.pages.length > 5 ? ['Only the first five requested pages were included in this direction.'] : [],
  };
}
