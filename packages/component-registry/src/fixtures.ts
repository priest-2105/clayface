import { type ClayfaceNode, type Direction, type Project, type Strategy } from '@clayface/schema';

export const strategies = {
  product: { name: 'Product-led', description: 'A clear opening, a tangible product preview, and room to explore.', hero: 'split' },
  editorial: { name: 'Editorial', description: 'Confident typography and a story that unfolds section by section.', hero: 'editorial' },
  minimal: { name: 'Essential', description: 'A focused message, fewer distractions, and one clear next step.', hero: 'centered' },
} as const;

export function createDirection(strategy: Strategy, brand = 'Forma', pageNames = ['Home', 'Features', 'Pricing', 'About', 'Contact']): Direction {
  const info = strategies[strategy];
  const makeNode = (page: string, componentId: ClayfaceNode['componentId'], variant: string, props: ClayfaceNode['props']): ClayfaceNode => ({
    id: `${strategy}-${page.toLowerCase()}-${componentId.replace('.', '-')}`, componentId, componentVersion: '1.0.0', variant, props, children: [],
  });
  return {
    id: `direction-${strategy}`, name: info.name, description: info.description, strategy,
    document: {
      schemaVersion: 1, designSystemId: 'system-forma', designSystemVersion: 1,
      pages: pageNames.map(name => {
        const route = name === 'Home' ? '/' : `/${name.toLowerCase()}`;
        const heroTitles: Record<string, string> = { Home: 'A little structure.\nA lot more clarity.', Features: 'Make room for\nyour best work.', Pricing: 'A plan for\nwhat comes next.', About: 'Good work starts\nwith a clear mind.', Contact: 'Let’s make\nsomething of it.' };
        const navigation = makeNode(name, 'navigation', strategy === 'minimal' ? 'centered' : 'simple', { brand: brand.toLowerCase(), action: 'Get started' });
        const hero = makeNode(name, 'hero', info.hero, { title: heroTitles[name] ?? name, body: 'Bring your notes, projects, and people together. One thoughtful space to turn the work in your head into the work that matters.', action: 'Find your focus' });
        const features = makeNode(name, 'features', strategy === 'editorial' ? 'list' : 'columns', { title: 'Everything in its right place.', body: 'Less looking for things. More moving things forward.', items: [
          { title: 'A home for every idea', body: 'Capture the spark. Connect the dots. Keep the good ideas close.' },
          { title: 'Progress you can see', body: 'Turn big plans into small, clear steps your whole team can follow.' },
          { title: 'Space to work together', body: 'Keep conversations next to the work, so everyone has the context.' },
        ] });
        const statement = makeNode(name, 'statement', strategy === 'editorial' ? 'wide' : 'inset', { title: 'Clear space.\nBetter thinking.', body: 'Work feels different when everything has a place. Build a rhythm that gives your team the freedom to focus.' });
        const pricing = makeNode(name, 'pricing', 'columns', { title: 'Start small. Grow at your pace.', body: 'Illustrative plans for this sample website.', items: [ { title: 'Personal', body: 'A calm space for your own projects.' }, { title: 'Together', body: 'Shared projects and context for a small team.' }, { title: 'Studio', body: 'An organized home for your whole practice.' } ] });
        const contact = makeNode(name, 'contact', 'split', { title: 'Tell us what’s on your mind.', body: 'This sample form demonstrates a contact layout. It does not send messages.' });
        const cta = makeNode(name, 'cta', strategy === 'minimal' ? 'centered' : 'band', { title: 'Make space for better work.', body: 'Your next good idea deserves a place to begin.', action: 'Get started with Forma' });
        const footer = makeNode(name, 'footer', strategy === 'editorial' ? 'columns' : 'simple', { brand: brand.toLowerCase(), body: 'A thoughtful space for the work that matters.' });
        let sections = name === 'Pricing' ? [pricing, features] : name === 'Contact' ? [contact] : name === 'About' ? [statement, features] : [features, statement];
        if (strategy === 'editorial' && name === 'Home') sections = [statement, features];
        if (strategy === 'minimal' && name === 'Home') sections = [features];
        return { id: `${strategy}-page-${name.toLowerCase()}`, name, route, root: { ...makeNode(name, 'layout.page', 'default', {}), children: [navigation, hero, ...sections, cta, footer] } };
      }),
    },
  };
}

export function createSampleProject(): Project {
  return {
    schemaVersion: 1, id: 'sample-forma', name: 'Forma', productType: 'Software / SaaS',
    brief: 'A thoughtful workspace for notes, projects, and people. Clear, inviting, and quietly confident.',
    designSystem: { id: 'system-forma', version: 1, name: 'Forma foundations', accent: '#405A4A', surface: '#F5F5EF', ink: '#252D28', radius: 'soft', density: 'comfortable', font: 'sans' },
    directions: [createDirection('product'), createDirection('editorial')],
  };
}
