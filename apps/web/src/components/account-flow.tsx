'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import type { Project, Strategy } from '@clayface/schema';
import { api, ApiError, accountPath, type Account } from '@/lib/api';
import { ClayfaceMark } from './ui';
import './account-flow.css';

export function AccountFrame({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return <main className="account-flow"><header className="account-header"><Link href="/" className="brand"><ClayfaceMark/><span>clayface</span></Link><span>A considered place to create.</span></header><div className={aside ? 'account-layout with-aside' : 'account-layout'}>{aside && <aside className="onboarding-aside">{aside}</aside>}<div className="account-content">{children}</div></div><footer className="account-footer">Your ideas, taking shape.</footer></main>;
}
export function PasswordField({ label = 'Password', name = 'password', autoComplete = 'current-password', help }: { label?: string; name?: string; autoComplete?: string; help?: string }) {
  const [visible, setVisible] = useState(false); const id = useId();
  return <div className="account-field"><label htmlFor={id}>{label}</label><span className="password-input"><input id={id} name={name} type={visible ? 'text' : 'password'} required maxLength={128} autoComplete={autoComplete} aria-describedby={help ? `${id}-help` : undefined}/><button type="button" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span>{help && <small id={`${id}-help`}>{help}</small>}</div>;
}
export function ErrorMessage({ message }: { message: string }) { return message ? <p className="account-error" role="alert">{message}</p> : null; }
export function Submit({ busy, children }: { busy: boolean; children: ReactNode }) { return <button className="account-primary" type="submit" disabled={busy}>{busy ? 'One moment…' : children}{!busy && <ArrowRight size={16}/>}</button>; }
export function CodeField() { return <label className="account-field">Authenticator or recovery code<input name="code" required autoComplete="one-time-code" spellCheck={false} maxLength={64}/><small>Enter a six-digit code from your app, or one of your saved recovery codes.</small></label>; }
const passwordHelp = 'At least 10 characters, including uppercase, lowercase, and a number.';

export function AuthFlow({ mode }: { mode: 'signin' | 'signup' | 'forgot-password' | 'reset-password' }) {
  const router = useRouter(); const [busy, setBusy] = useState(false), [error, setError] = useState(''), [done, setDone] = useState(false), [factor, setFactor] = useState(false);
  useEffect(() => {
    if (mode !== 'signin' && mode !== 'signup') return;
    let active = true;
    api<{ user: Account }>('/auth/session').then(({ user }) => { if (active) router.replace(accountPath(user)); }).catch(() => { /* Signed-out visitors can use the form. */ });
    return () => { active = false; };
  }, [mode, router]);
  const heading = factor ? 'One more check.' : { signin: 'Welcome back.', signup: 'Make space for your next idea.', 'forgot-password': 'Let’s get you back in.', 'reset-password': 'Choose a new password.' }[mode];
  const description = factor ? 'Open your authenticator to finish signing in.' : { signin: 'Sign in to pick up where you left off.', signup: 'Create an account. We’ll help you shape your first website, one step at a time.', 'forgot-password': 'Enter your account email and we’ll send a reset link.', 'reset-password': 'Choose a password you haven’t used before.' }[mode];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (mode === 'forgot-password') { await api('/auth/forgot-password', data); setDone(true); }
      else if (mode === 'reset-password') { await api('/auth/reset-password', { ...data, token: new URLSearchParams(window.location.search).get('token') ?? '' }); setDone(true); }
      else {
        const result = await api<{ user?: Account; requiresTwoFactor?: boolean }>(factor ? '/auth/two-factor/verify' : `/auth/${mode}`, data);
        if (result.requiresTwoFactor) setFactor(true); else if (result.user) router.replace(accountPath(result.user));
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Please try again.'); } finally { setBusy(false); }
  }
  return <AccountFrame><section className="account-panel"><h1>{done ? mode === 'forgot-password' ? 'Check your email.' : 'Your password is updated.' : heading}</h1><p className="account-description">{done ? mode === 'forgot-password' ? 'If an account matches that address, you’ll receive a link valid for 30 minutes. Check your spam folder too.' : 'Sign in with your new password. Your other sessions have been signed out.' : description}</p>{done ? <Link className="account-primary" href="/signin">Back to sign in<ArrowRight size={16}/></Link> : <form onSubmit={submit} aria-busy={busy} key={`${mode}-${factor}`}><fieldset disabled={busy}>{factor ? <CodeField/> : <>{mode !== 'reset-password' && <label className="account-field">Email address<input name="email" type="email" autoComplete="email" maxLength={320} required placeholder="you@example.com"/></label>}{mode !== 'forgot-password' && <PasswordField autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} help={mode === 'signin' ? undefined : passwordHelp}/>}</>}<ErrorMessage message={error}/><Submit busy={busy}>{factor ? 'Verify and sign in' : { signin: 'Sign in', signup: 'Create account', 'forgot-password': 'Send reset link', 'reset-password': 'Update password' }[mode]}</Submit></fieldset></form>}{!done && <div className="account-links">{factor ? <button onClick={() => { setFactor(false); setError(''); }}>Use a different account</button> : mode === 'signin' ? <><Link href="/forgot-password">Forgot password?</Link><span>New to Clayface? <Link href="/signup">Create an account</Link></span></> : mode === 'signup' ? <span>Already have an account? <Link href="/signin">Sign in</Link></span> : <Link href="/signin"><ArrowLeft size={14}/>Back to sign in</Link>}</div>}</section></AccountFrame>;
}

const steps = ['Your name', 'Your project', 'Your first design'];
const styles: { id: Strategy; title: string; text: string }[] = [
  { id: 'product', title: 'Product-led', text: 'A clear introduction with room to show what you offer.' },
  { id: 'editorial', title: 'Editorial', text: 'Expressive type and a story that unfolds as you scroll.' },
  { id: 'minimal', title: 'Essential', text: 'A focused message with fewer sections and distractions.' },
];
export function OnboardingFlow() {
  const router = useRouter(), titleRef = useRef<HTMLHeadingElement>(null);
  const [user, setUser] = useState<Account | null>(null), [step, setStep] = useState(0), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [name, setName] = useState(''), [projectName, setProjectName] = useState(''), [brief, setBrief] = useState(''), [type, setType] = useState<Project['productType']>('Software / SaaS');
  const [pages, setPages] = useState(['Home', 'Features', 'Pricing', 'About', 'Contact']), [strategy, setStrategy] = useState<Strategy>('product');
  useEffect(() => { let active = true; async function load() {
    try {
      const session = await api<{ user: Account }>('/auth/session'); if (!active) return;
      if (session.user.onboardingStep === 'complete') { router.replace('/dashboard'); return; }
      const result = await api<{ project: { name: string; brief: string; product_type: string; page_names: string[] } | null }>('/project'); if (!active) return;
      setUser(session.user); setName(session.user.name ?? ''); setStep(['name','project','design'].indexOf(session.user.onboardingStep));
      if (result.project) { setProjectName(result.project.name); setBrief(result.project.brief); setPages(result.project.page_names); setType(result.project.product_type === 'AGENCY_STUDIO' ? 'Agency / studio' : result.project.product_type === 'SERVICE_BUSINESS' ? 'Service business' : 'Software / SaaS'); }
    } catch (err) { if (err instanceof ApiError && err.status === 401) router.replace('/signin'); else setError(err instanceof Error ? err.message : 'Could not open setup.'); }
  } void load(); return () => { active = false; }; }, [router]);
  useEffect(() => { titleRef.current?.focus(); }, [step]);
  async function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (step === 0) { const result = await api<{ user: Account }>('/onboarding/name', { name }); setUser(result.user); setStep(1); }
      else if (step === 1) { const result = await api<{ user: Account }>('/onboarding/project', { name: projectName, brief, productType: type, pages }); setUser(result.user); setStep(2); }
      else { await api('/onboarding/design', { strategy }); router.replace('/dashboard'); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Your changes could not be saved.'); } finally { setBusy(false); }
  }
  if (!user) return <AccountFrame><section className="account-panel"><h1>Opening your setup…</h1><ErrorMessage message={error}/>{error && <button className="account-primary" onClick={() => location.reload()}>Try again</button>}</section></AccountFrame>;
  return <AccountFrame aside={<><h2>A website that starts with you.</h2><p>Three small steps. Then a real design you can make your own.</p><ol className="onboarding-steps">{steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} className={index === step ? 'current' : index < step ? 'complete' : ''}><span>{index < step ? <Check size={16}/> : index + 1}</span><div>{label}<small>{['How we’ll greet you', 'What you’re building', 'A starting direction'][index]}</small></div></li>)}</ol><button className="account-text-button" onClick={async () => { await api('/auth/signout', {}); router.replace('/signin'); }}>Sign out</button></>}><section className="account-panel onboarding-panel"><p className="step-progress" aria-live="polite">Step {step + 1} of 3</p><h1 tabIndex={-1} ref={titleRef}>{['What should we call you?', 'What are you creating?', 'Choose your starting direction.'][step]}</h1><p className="account-description">{['Just your name for now. You can change it later.', 'Tell us a little about your project. We’ll use this to build your first pages.', `${projectName} is ready for a first draft. Choose a layout; you can explore other directions later.`][step]}</p><form onSubmit={next} aria-busy={busy}><fieldset disabled={busy}>{step === 0 ? <label className="account-field">Your name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" minLength={2} maxLength={80} required placeholder="Alex"/></label> : step === 1 ? <><label className="account-field">Project name<input value={projectName} onChange={e => setProjectName(e.target.value)} maxLength={80} required placeholder="Northstar"/></label><label className="account-field">What kind of website?<select value={type} onChange={e => setType(e.target.value as Project['productType'])}><option>Software / SaaS</option><option>Agency / studio</option><option>Service business</option></select></label><label className="account-field">What do you do, and who is it for?<textarea value={brief} onChange={e => setBrief(e.target.value)} minLength={10} maxLength={1000} required rows={4} placeholder="We help small teams plan their work in one calm, shared space."/><small>A sentence or two is enough. You can edit the words later.</small></label><fieldset className="page-options"><legend>Pages to start with</legend>{['Home','Features','Pricing','About','Contact'].map(page => <label key={page}><input type="checkbox" checked={pages.includes(page)} disabled={page === 'Home'} onChange={e => setPages(e.target.checked ? [...pages,page] : pages.filter(item => item !== page))}/>{page}{page === 'Home' && <small>included</small>}</label>)}</fieldset></> : <fieldset className="style-options"><legend className="sr-only">Design direction</legend>{styles.map(style => <label key={style.id} className={strategy === style.id ? 'selected' : ''}><input type="radio" name="strategy" value={style.id} checked={strategy === style.id} onChange={() => setStrategy(style.id)}/><span><strong>{style.title}</strong><small>{style.text}</small></span></label>)}</fieldset>}<ErrorMessage message={error}/><div className="onboarding-actions">{step > 0 && <button type="button" className="account-back" onClick={() => { setStep(step - 1); setError(''); }}><ArrowLeft size={15}/>Back</button>}<Submit busy={busy}>{step === 2 ? 'Create my first design' : 'Continue'}</Submit></div></fieldset></form>{step === 2 && <p className="account-note"><ShieldCheck size={15}/>Your project is private to your account.</p>}</section></AccountFrame>;
}
