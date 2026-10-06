'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Image, Search, Shapes } from 'lucide-react';
import { registry, type RegistryEntry } from '@clayface/registry';
import { Button, EmptyState, ModalDialog } from './ui';

export function ComponentCatalog() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<RegistryEntry | null>(null);
  const entries = registry.filter(entry => entry.id !== 'layout.page' && `${entry.name} ${entry.category}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="workspace-page"><div className="page-heading"><div><h1>Component library</h1><p>Considered building blocks. A shared language for your pages.</p></div><span className="version-badge"><Shapes size={13}/>{registry.length - 1} registered components</span></div><div className="catalog-search"><Search size={16}/><input aria-label="Search components" placeholder="Find a component…" value={query} onChange={event => setQuery(event.target.value)}/><kbd>/</kbd></div>{entries.length ? <div className="component-grid">{entries.map(entry => <button className="catalog-component" key={entry.id} onClick={() => setSelected(entry)}><div className={`component-drawing drawing-${entry.id}`} aria-hidden="true"><i/><i/><i/><i/><i/></div><div className="catalog-component-info"><span><strong>{entry.name}</strong><ArrowUpRight size={14}/></span><p>{entry.description}</p><small>{entry.variants.length} variants<span>v{entry.version}</span></small></div></button>)}</div> : <EmptyState title="No components found." description="Try a different name, such as hero, navigation, or features."><Button onClick={() => setQuery('')}>Clear search</Button></EmptyState>}
    <ModalDialog open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? 'Component'} description={selected?.description}><div className="component-details"><div><strong>Available variants</strong><div className="detail-chips">{selected?.variants.map(variant => <span key={variant.id}>{variant.label}</span>)}</div></div><div><strong>Editable content</strong><div className="detail-chips">{selected?.fields.map(field => <span key={field.key}>{field.label}</span>)}</div></div><p><Check size={14}/>Uses your project’s colors, typography, and spacing.</p><p className="field-help">Select this section in the editor to change its content or variant. Adding arbitrary sections will follow in the next editor milestone.</p></div><div className="dialog-actions"><Button onClick={() => setSelected(null)}>Back to library</Button></div></ModalDialog>
  </div>;
}

export function Assets() {
  return <div className="workspace-page"><div className="page-heading"><div><h1>Project assets</h1><p>A shared home for the images and files your project uses.</p></div><span className="version-badge"><Image size={13}/>0 files</span></div><EmptyState title="Your visuals will live here." description="The sample project uses native interface elements. Image uploads and project storage will be connected in the asset milestone."><span className="asset-types">Images · Icons · Brand assets</span></EmptyState><div className="asset-note"><Shapes size={18}/><div><strong>Shared across every direction</strong><p>Assets will be referenced once and reused wherever your project needs them.</p></div></div></div>;
}
