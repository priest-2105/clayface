import { z } from 'zod';

export const componentIds = ['layout.page', 'navigation', 'hero', 'features', 'statement', 'pricing', 'contact', 'cta', 'footer'] as const;
export type ComponentId = typeof componentIds[number];
export const strategySchema = z.enum(['product', 'editorial', 'minimal']);
export type Strategy = z.infer<typeof strategySchema>;

export const contentSchema = z.object({
  title: z.string().max(240).optional(),
  body: z.string().max(2000).optional(),
  action: z.string().max(80).optional(),
  brand: z.string().max(80).optional(),
  items: z.array(z.object({ title: z.string().max(120), body: z.string().max(500) }).strict()).max(12).optional(),
}).strict();

export type ClayfaceNode = {
  id: string;
  componentId: ComponentId;
  componentVersion: '1.0.0';
  variant: string;
  props: z.infer<typeof contentSchema>;
  children: ClayfaceNode[];
};
export const nodeSchema: z.ZodType<ClayfaceNode> = z.lazy(() => z.object({
  id: z.string().min(1).max(100),
  componentId: z.enum(componentIds),
  componentVersion: z.literal('1.0.0'),
  variant: z.string().min(1).max(40),
  props: contentSchema,
  children: z.array(nodeSchema).max(30),
}).strict());

export const pageSchema = z.object({ id: z.string(), name: z.string().min(1).max(80), route: z.string().startsWith('/'), root: nodeSchema }).strict();
export const designSystemSchema = z.object({
  id: z.string(), version: z.number().int().positive(), name: z.string().min(1).max(80),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  surface: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  ink: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  radius: z.enum(['square', 'soft', 'round']),
  density: z.enum(['compact', 'comfortable', 'spacious']),
  font: z.enum(['sans', 'serif']),
}).strict();
export type DesignSystem = z.infer<typeof designSystemSchema>;
export function contrastRatio(first: string, second: string): number {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
export const documentSchema = z.object({
  schemaVersion: z.literal(1),
  designSystemId: z.string(),
  designSystemVersion: z.number().int().positive(),
  pages: z.array(pageSchema).min(1).max(5),
}).strict();
export type ClayfaceDocument = z.infer<typeof documentSchema>;
export type ClayfacePage = z.infer<typeof pageSchema>;

export const directionSchema = z.object({
  id: z.string(), name: z.string().min(1).max(80), strategy: strategySchema,
  description: z.string().max(500), document: documentSchema,
}).strict();
export type Direction = z.infer<typeof directionSchema>;
export const projectSchema = z.object({
  schemaVersion: z.literal(1), id: z.string(), name: z.string().min(1).max(80),
  productType: z.enum(['Software / SaaS', 'Agency / studio', 'Service business']),
  brief: z.string().max(1000),
  designSystem: designSystemSchema,
  directions: z.array(directionSchema).max(3),
}).strict();
export type Project = z.infer<typeof projectSchema>;

export type ContentKey = 'title' | 'body' | 'action' | 'brand';
export type EditorOperation =
  | { type: 'setContent'; nodeId: string; key: ContentKey; value: string }
  | { type: 'setVariant'; nodeId: string; value: string }
  | { type: 'moveNode'; pageId: string; nodeId: string; offset: -1 | 1 };

export function findNode(document: ClayfaceDocument, nodeId: string): ClayfaceNode | undefined {
  const walk = (node: ClayfaceNode): ClayfaceNode | undefined => node.id === nodeId ? node : node.children.map(walk).find(Boolean);
  return document.pages.map(page => walk(page.root)).find(Boolean);
}
