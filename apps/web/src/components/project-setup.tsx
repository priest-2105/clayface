'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, Palette, Shapes } from 'lucide-react';
import { useWorkspace } from '@clayface/editor';
import type { Project } from '@clayface/schema';
import { Button, ModalDialog } from './ui';

export function ProjectSetup({ open, onClose, onComplete }: { open: boolean; onClose: () => void; onComplete: () => void }) {
  const state = useWorkspace();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(state.project.name);
  const [productType, setProductType] = useState<Project['productType']>(state.project.productType);
  const [brief, setBrief] = useState(state.project.brief);
  const [pages, setPages] = useState(['Home', 'Features', 'Pricing', 'About', 'Contact']);
  const [error, setError] = useState('');
  const labels = ['Your project', 'Foundations', 'Review'];
  return <ModalDialog open={open} onClose={onClose} wide title={['Give your ideas a little structure.', 'Start with good foundations.', 'Ready to see it take shape?'][step]} description={['A few details to give your project a clear starting point.', 'Use Clayface’s sample system. You can make it your own in the Design System workspace.', 'Review your sample brief before opening the editor.'][step]}><ol className="setup-steps">{labels.map((label, index) => <li key={label} className={index <= step ? 'is-active' : ''}><span>{index < step ? <Check size={11}/> : index + 1}</span>{label}</li>)}</ol>
    {step === 0 && <div className="setup-form"><label className="field"><span>Project name</span><input autoFocus value={name} maxLength={80} onChange={event => setName(event.target.value)} placeholder="What are you working on?"/></label><label className="field"><span>What are you building?</span><select value={productType} onChange={event => setProductType(event.target.value as Project['productType'])}><option>Software / SaaS</option><option>Agency / studio</option><option>Service business</option></select></label><label className="field"><span>A little context <small>Optional</small></span><textarea rows={3} maxLength={1000} value={brief} onChange={event => setBrief(event.target.value)} placeholder="Who is it for? What should it help them do?"/></label><fieldset className="page-checkboxes"><legend>Pages to include</legend>{['Home', 'Features', 'Pricing', 'About', 'Contact'].map(page => <label key={page}><input type="checkbox" checked={pages.includes(page)} disabled={page === 'Home'} onChange={event => setPages(event.target.checked ? [...pages, page] : pages.filter(item => item !== page))}/><FileText size={13}/>{page}</label>)}</fieldset></div>}
    {step === 1 && <div className="foundation-choice"><div className="foundation-selected"><Palette size={22}/><div><strong>Start with Clayface</strong><p>Balanced typography, quiet colors, and considered spacing.</p></div><Check size={18}/></div><div className="foundation-samples"><span style={{ background: '#405A4A' }}/><span style={{ background: '#F5F5EF' }}/><span style={{ background: '#252D28' }}/><b>Aa</b><span className="foundation-radius">6</span></div><div className="future-sources"><span>More ways to start</span><p>Figma import, design-system JSON, and custom system setup will connect in later milestones.</p></div></div>}
    {step === 2 && <div className="setup-review"><span className="review-project-icon"><Shapes size={24}/></span><h3>{name}</h3><p>{brief || 'A fresh project, ready for your ideas.'}</p><dl><div><dt>Project type</dt><dd>{productType}</dd></div><div><dt>Design system</dt><dd>Clayface sample foundations</dd></div><div><dt>Pages</dt><dd>{pages.join(', ')}</dd></div><div><dt>First direction</dt><dd>Product-led sample</dd></div></dl><p className="sample-disclosure">Opening this sample replaces the current browser workspace. Download its document first if you want to keep a copy. Existing server accounts and projects are unaffected.</p></div>}
    {error && <p className="error-text" role="alert">{error}</p>}<div className="dialog-actions setup-actions">{step > 0 ? <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={14}/>Back</Button> : <Button variant="ghost" onClick={onClose}>Cancel</Button>}<Button variant="primary" onClick={() => { if (!name.trim()) { setError('Give your project a name to continue.'); return; } setError(''); if (step < 2) setStep(step + 1); else { state.setupProject(name.trim(), productType, brief, ['Home', 'Features', 'Pricing', 'About', 'Contact'].filter(page => pages.includes(page))); onClose(); onComplete(); setStep(0); } }}>{step < 2 ? 'Continue' : 'Open sample workspace'}<ArrowRight size={14}/></Button></div>
  </ModalDialog>;
}
