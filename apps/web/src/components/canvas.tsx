'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PageRenderer } from '@clayface/components';
import { previewStyles } from '@clayface/components/styles';
import type { ClayfacePage, DesignSystem } from '@clayface/schema';

const FRAME_DOCUMENT = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Design canvas</title><style>html,body{margin:0}body{overflow:hidden}</style></head><body><main id="canvas-root"></main></body></html>';

export function Canvas({ page, system, selectedId, onSelect, viewport, zoom }: { page: ClayfacePage; system: DesignSystem; selectedId: string | null; onSelect: (id: string) => void; viewport: number; zoom: number | 'fit' }) {
  const container = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(800);
  const [height, setHeight] = useState(1600);
  const scale = zoom === 'fit' ? Math.min(1, (availableWidth - 64) / viewport) : zoom / 100;

  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(entry.contentRect.width));
    observer.observe(container.current); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!root) return;
    const observer = new ResizeObserver(() => setHeight(root.getBoundingClientRect().height));
    observer.observe(root); return () => observer.disconnect();
  }, [root]);

  return <div className="canvas-scroll" ref={container}>
    <div className="canvas-paper-label" style={{ width: viewport * scale }}><span>{page.name}</span><span>{viewport} px</span></div>
    <div className="canvas-paper" style={{ width: viewport * scale, height: height * scale }}>
      <iframe ref={frame} title="Design canvas" sandbox="allow-same-origin" srcDoc={FRAME_DOCUMENT} onLoad={() => {
        const doc = frame.current?.contentDocument;
        if (doc) setRoot(doc.getElementById('canvas-root'));
      }} style={{ width: viewport, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}/>
      {root && createPortal(<><style>{previewStyles}</style><PageRenderer page={page} system={system} selectedId={selectedId} onSelect={onSelect}/></>, root)}
    </div>
    <div className="canvas-end">End of {page.name.toLowerCase()} page <span>·</span> {page.root.children.length} sections</div>
  </div>;
}
