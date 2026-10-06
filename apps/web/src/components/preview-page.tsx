'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useWorkspace } from '@clayface/editor';
import { PageRenderer } from '@clayface/components';
import { previewStyles } from '@clayface/components/styles';

export function PreviewPage() {
  const state = useWorkspace();
  useEffect(() => state.hydrate(), [state.hydrate]);
  const direction = state.project.directions.find(item => item.id === state.directionId) ?? state.project.directions[0];
  const page = direction?.document.pages.find(item => item.route === state.pageRoute) ?? direction?.document.pages[0];
  return <main className="preview-page"><div className="preview-topbar"><Link href="/dashboard"><ArrowLeft size={15}/>Back to editor</Link><span>{state.project.name}<i>/</i>{direction?.name ?? 'No direction'}</span><label><select aria-label="Preview page" value={page?.route ?? '/'} onChange={event => state.selectPage(event.target.value)}>{direction?.document.pages.map(item => <option value={item.route} key={item.id}>{item.name}</option>)}</select><ChevronDown size={12}/></label><span className="sample-chip">Preview</span></div>{!state.hydrated ? <div className="loading-workspace" role="status">Opening your preview…</div> : state.storageError ? <div className="preview-empty"><h1>We couldn’t read the saved workspace.</h1><p>Return to the editor to download a backup and recover it.</p><Link href="/dashboard">Back to editor</Link></div> : page ? <><style>{previewStyles}</style><PageRenderer page={page} system={state.project.designSystem} onNavigate={route => { if (direction.document.pages.some(item => item.route === route)) { state.selectPage(route); window.scrollTo({ top: 0, behavior: 'instant' }); } }}/></> : <div className="preview-empty"><h1>No direction to preview yet.</h1><Link href="/dashboard">Return to your workspace</Link></div>}</main>;
}
