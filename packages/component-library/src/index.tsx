'use client';

import { type CSSProperties } from 'react';
import { ArrowUpRight, ArrowRight, Check, CheckCircle2, ChevronDown, Circle, FileText, Folder, Plus, Search, Sun, Layers3 } from 'lucide-react';
import type { ClayfaceNode, ClayfacePage, DesignSystem } from '@clayface/schema';

function FormaMark() { return <svg width="26" height="28" viewBox="0 0 26 28" aria-hidden="true"><path fill="currentColor" d="M2 2h22v6H2zM2 11h16v6H2zM2 20h10v6H2z" /></svg>; }

function ProductScene() {
  return <div className="product-scene" aria-label="Sample Forma project interface">
    <div className="scene-toolbar"><span className="scene-brand"><FormaMark />forma</span><span className="scene-search"><Search size={11} /> Search anything <kbd>⌘ K</kbd></span><span className="scene-avatar">A</span></div>
    <div className="scene-body"><div className="scene-sidebar"><span className="scene-person">Personal workspace<ChevronDown size={10}/></span><span><Sun size={12}/>My day</span><span><FileText size={12}/>Notes</span><span className="scene-active"><Folder size={12}/>Projects</span><span><Layers3 size={12}/>Resources</span><small>Your spaces</small><span><i className="scene-dot"/>Studio website</span><span><i className="scene-dot gold"/>Good ideas</span></div>
    <div className="scene-content"><div className="scene-breadcrumb">Projects <span>/</span> Studio website</div><span className="scene-folder"><Folder size={22}/></span><h3>A fresh perspective.</h3><p>A new home for what we do best.</p><div className="scene-tabs"><strong>Overview</strong><span>Tasks</span><span>Notes</span><Plus size={11}/></div><div className="scene-task"><CheckCircle2 size={14}/><span>Define the direction<small>Make it feel like us.</small></span><span className="task-status">Done</span></div><div className="scene-task"><Circle size={14}/><span>Give the ideas a home<small>A little room to explore.</small></span><span className="scene-avatar small">J</span></div><div className="scene-task"><Circle size={14}/><span>Bring it all together</span><span className="scene-avatar small">A</span></div><div className="scene-note"><span>Room for a good idea.</span><Plus size={12}/></div></div></div>
    <span className="scene-float"><CheckCircle2 size={17}/><span>A little more clarity.<small>Everything, right where you need it.</small></span></span>
  </div>;
}

type RendererProps = { page: ClayfacePage; system: DesignSystem; selectedId?: string | null; onSelect?: (id: string) => void; onNavigate?: (route: string) => void };

function Section({ node, onNavigate }: { node: ClayfaceNode; onNavigate?: (route: string) => void }) {
  const { props, variant, componentId } = node;
  const navigate = (route: string) => onNavigate?.(route);
  const action = <button type="button" className="site-button" onClick={() => navigate('/contact')}>{props.action}<ArrowUpRight size={15}/></button>;
  switch (componentId) {
    case 'navigation': return <nav className={`site-nav variant-${variant}`} aria-label="Website navigation"><button className="site-brand" onClick={() => navigate('/')}><FormaMark/>{props.brand}</button><div className="site-nav-links"><button onClick={() => navigate('/features')}>Features</button><button onClick={() => navigate('/pricing')}>Pricing</button><button onClick={() => navigate('/about')}>Our story</button></div><button className="site-nav-action" onClick={() => navigate('/contact')}>{props.action}<ArrowUpRight size={13}/></button></nav>;
    case 'hero': return <section className={`site-hero variant-${variant}`}><div className="hero-copy"><h1>{props.title}</h1><p>{props.body}</p><div className="hero-actions">{action}<span>A little less busy.<br/>A little more you.</span></div></div>{variant !== 'editorial' && <ProductScene/>}{variant === 'editorial' && <div className="editorial-rule"><span>Ideas. Plans. Possibilities.</span><ArrowUpRight size={36}/></div>}</section>;
    case 'features': return <section className={`site-features variant-${variant}`}><div className="section-intro"><h2>{props.title}</h2><p>{props.body}</p></div><div className="feature-items">{props.items?.map((item, i) => <div className="feature-item" key={item.title}>{[<FileText key="file"/>, <CheckCircle2 key="check"/>, <Layers3 key="layer"/>][i % 3]}<h3>{item.title}</h3><p>{item.body}</p></div>)}</div></section>;
    case 'statement': return <section className={`site-statement variant-${variant}`}><h2>{props.title}</h2><p>{props.body}</p></section>;
    case 'pricing': return <section className={`site-pricing variant-${variant}`}><h2>{props.title}</h2><p>{props.body}</p><div className="pricing-items">{props.items?.map((item, index) => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p><strong>{['Free', '$12', '$24'][index]}<small>{index > 0 && ' / month'}</small></strong><span><Check size={14}/> Your work, organized</span><span><Check size={14}/> Room to grow</span><button className="site-button" onClick={() => navigate('/contact')}>Explore {item.title}<ArrowRight size={14}/></button></article>)}</div></section>;
    case 'contact': return <section className={`site-contact variant-${variant}`}><div><h2>{props.title}</h2><p>{props.body}</p></div><form onSubmit={event => event.preventDefault()}><label>Your name<input placeholder="Alex Morgan" disabled /></label><label>Email<input placeholder="alex@example.com" type="email" disabled /></label><label>What are you working on?<textarea placeholder="Tell us a little about it…" disabled /></label><button className="site-button" disabled>Sample form</button></form></section>;
    case 'cta': return <section className={`site-cta variant-${variant}`}><div><h2>{props.title}</h2><p>{props.body}</p></div>{action}</section>;
    case 'footer': return <footer className={`site-footer variant-${variant}`}><div><span className="site-brand"><FormaMark/>{props.brand}</span><p>{props.body}</p></div><div className="footer-links"><button onClick={() => navigate('/features')}>Features</button><button onClick={() => navigate('/about')}>Our story</button><button onClick={() => navigate('/contact')}>Say hello<ArrowUpRight size={12}/></button></div><span className="footer-note">Made with a little intention.</span></footer>;
    default: return null;
  }
}

export function PageRenderer({ page, system, selectedId, onSelect, onNavigate }: RendererProps) {
  const style = { '--site-accent': system.accent, '--site-surface': system.surface, '--site-ink': system.ink, '--site-radius': system.radius === 'square' ? '0px' : system.radius === 'soft' ? '6px' : '16px', '--site-section': system.density === 'compact' ? '48px' : system.density === 'comfortable' ? '72px' : '96px', '--site-font': system.font === 'serif' ? 'Georgia, serif' : '"Geist", Arial, sans-serif' } as CSSProperties;
  return <div className={`rendered-site ${onSelect ? 'is-editing' : ''}`} style={style}>
    {page.root.children.map(node => <div key={node.id} data-node-id={node.id} className={`rendered-node ${selectedId === node.id ? 'is-selected' : ''}`} onClickCapture={onSelect ? event => { event.preventDefault(); event.stopPropagation(); onSelect(node.id); } : undefined}>
      {onSelect && <button className="node-select" onClick={() => onSelect(node.id)} aria-label={`Select ${node.componentId} section`}>{node.componentId === 'cta' ? 'Call to action' : node.componentId}<span>{node.variant}</span></button>}
      <Section node={node} onNavigate={onNavigate}/>
    </div>)}
  </div>;
}
