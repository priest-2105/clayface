'use client';

import { ArrowUpRight, Check, Plus, Trash2 } from 'lucide-react';
import { useWorkspace } from '@clayface/editor';
import { strategies } from '@clayface/registry/fixtures';
import type { Strategy } from '@clayface/schema';
import { Button, IconButton, ModalDialog, EmptyState } from './ui';
import { useState } from 'react';

export function DirectionThumbnail({ strategy, accent }: { strategy: Strategy; accent: string }) {
  return <div className={`direction-thumbnail thumbnail-${strategy}`} style={{ '--thumbnail-accent': accent } as React.CSSProperties} aria-hidden="true"><div className="thumb-nav"><b>forma</b><span/><span/><i/></div><div className="thumb-hero"><div><strong>{strategy === 'editorial' ? 'Room for\na new perspective.' : 'A little structure.\nA lot more clarity.'}</strong><p/><p/><i/></div>{strategy === 'product' && <div className="thumb-app"><header/><aside/><article><b/><span/><span/><span/></article></div>}</div><div className="thumb-sections"><span/><span/><span/></div></div>;
}

export function Directions({ onOpen, onNew }: { onOpen: () => void; onNew: () => void }) {
  const state = useWorkspace();
  const [deleting, setDeleting] = useState<string | null>(null);
  const target = state.project.directions.find(direction => direction.id === deleting);
  return <div className="workspace-page"><div className="page-heading"><div><h1>Your directions</h1><p>Different ways forward. One shared design system.</p></div><Button variant="primary" disabled={state.project.directions.length >= 3} onClick={onNew}><Plus size={15}/>New direction</Button></div><div className="page-subline"><span>{state.project.directions.length} of 3 direction slots used</span><span className="subtle-label">Generated compositions</span></div>
    {state.project.directions.length ? <div className="direction-grid">{state.project.directions.map((direction, index) => <article className="direction-card" key={direction.id}><button className="direction-preview-button" aria-label={`Open ${direction.name}`} onClick={() => { state.selectDirection(direction.id); onOpen(); }}><DirectionThumbnail strategy={direction.strategy} accent={state.project.designSystem.accent}/><span className="preview-open">Open direction<ArrowUpRight size={14}/></span></button><div className="direction-card-info"><div className="direction-card-title"><span className="direction-number">0{index + 1}</span><h2>{direction.name}</h2>{direction.id === state.directionId && <span className="active-label"><Check size={11}/>Active</span>}<IconButton label={`Delete ${direction.name}`} onClick={() => setDeleting(direction.id)}><Trash2 size={14}/></IconButton></div><p>{direction.description}</p><div className="direction-card-meta"><span>{direction.document.pages.length} pages</span><span>System v{direction.document.designSystemVersion}</span></div></div></article>)}{state.project.directions.length < 3 && <button className="new-direction-card" onClick={onNew}><span><Plus size={22}/></span><strong>Explore another direction</strong><p>A fresh composition.<br/>The same foundations.</p></button>}</div> : <EmptyState title="A fresh direction starts here." description="Add a composition to explore the editor and your design system."><Button variant="primary" onClick={onNew}><Plus size={15}/>Add a direction</Button></EmptyState>}
    <div className="directions-footnote"><span className="tiny-dot"/>A direction changes the composition. Your project’s design system keeps it all connected.</div>
    <ModalDialog open={Boolean(target)} onClose={() => setDeleting(null)} title={`Delete ${target?.name ?? 'direction'}?`} description="This removes the direction and its edits from your project. The other directions and your design system are kept."><div className="dialog-actions"><Button onClick={() => setDeleting(null)}>Keep direction</Button><Button variant="danger" onClick={() => { if (deleting) state.deleteDirection(deleting); setDeleting(null); }}>Delete direction</Button></div></ModalDialog>
  </div>;
}

export function NewDirectionDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const state = useWorkspace();
  const [selected, setSelected] = useState<Strategy | null>(null);
  const available = (Object.keys(strategies) as Strategy[]).filter(strategy => !state.project.directions.some(direction => direction.strategy === strategy));
  const choice = selected && available.includes(selected) ? selected : available[0];
  return <ModalDialog open={open} onClose={onClose} wide title={available.length ? 'A different way to tell your story.' : 'All three directions are in use.'} description={available.length ? 'Choose a composition to explore. It will use your current design system and page list.' : 'Delete a direction to make space for a new one. You can keep exploring and editing your existing directions.'}>{available.length ? <><div className="strategy-options">{available.map(strategy => <button className={choice === strategy ? 'strategy-option is-active' : 'strategy-option'} aria-pressed={choice === strategy} key={strategy} onClick={() => setSelected(strategy)}><DirectionThumbnail strategy={strategy} accent={state.project.designSystem.accent}/><strong>{strategies[strategy].name}{choice === strategy && <Check size={15}/>}</strong><p>{strategies[strategy].description}</p></button>)}</div><p className="sample-disclosure">Your brief and page choices are used to create an editable starting point.</p><div className="dialog-actions"><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={() => { if (choice) state.addDirection(choice); onClose(); onCreated(); }}>Create direction<ArrowUpRight size={14}/></Button></div></> : <div className="dialog-actions"><Button onClick={onClose}>Back to workspace</Button></div>}</ModalDialog>;
}
