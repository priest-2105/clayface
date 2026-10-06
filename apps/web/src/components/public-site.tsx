'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check, FileText, Layers3, Menu, MousePointer2, Palette, X } from 'lucide-react';
import { ClayfaceMark } from './ui';
import { routes } from '@/lib/routes';
import './public-site.css';

export function PublicFrame({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false), pathname = usePathname();
  return <div className={`public-site ${pathname === routes.home ? 'public-home' : ''}`}><a className="skip-link" href="#public-main">Skip to content</a>
    <header className="public-header"><Link href={routes.home} className="public-brand" aria-label="Clayface home"><ClayfaceMark/><span>clayface</span></Link>
      <button className="public-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="public-navigation" onClick={() => setOpen(!open)}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
      <nav id="public-navigation" className={open ? 'public-navigation is-open' : 'public-navigation'} aria-label="Public navigation" onClick={() => setOpen(false)}>
        <Link href={routes.product} aria-current={pathname === routes.product ? 'page' : undefined}>Product</Link><Link href={routes.help} aria-current={pathname === routes.help ? 'page' : undefined}>Help & resources</Link>
        <div className="public-nav-account"><Link href={routes.dashboard}>Open dashboard<ArrowRight size={14}/></Link><Link href={routes.signin}>Log in</Link><Link className="public-button" href={routes.signup}>Get started</Link></div>
      </nav>
    </header>
    <main id="public-main" tabIndex={-1}>{children}</main>
    <footer className="public-footer"><div><Link href={routes.home} className="public-brand"><ClayfaceMark/><span>clayface</span></Link><p>A place for your next website to take shape.</p></div><nav aria-label="Footer navigation"><Link href={routes.product}>Product</Link><Link href={routes.help}>Help</Link><Link href={routes.signin}>Log in</Link><Link href={routes.dashboard}>Your dashboard</Link></nav><span>© {new Date().getFullYear()} Clayface</span></footer>
  </div>;
}

const directions = ['Product-led', 'Editorial', 'Essential'] as const;
const colors = [{ name: 'Blue', color: '#245bea', surface: '#eef3ff' }, { name: 'Forest', color: '#28664d', surface: '#edf5ef' }, { name: 'Violet', color: '#7652bd', surface: '#f3effc' }];

function ProductDemo() {
  const [direction, setDirection] = useState(0), [color, setColor] = useState(0);
  return <section className="public-demo" aria-label="Interactive example website">
    <div className="demo-toolbar"><span><Layers3 size={16}/>One idea. A few possibilities.</span><span className="demo-example">Interactive example</span></div>
    <div className="demo-body"><aside className="demo-controls"><div className="demo-project"><span>N</span><div><strong>Northstar</strong><small>Example project</small></div></div>
      <fieldset><legend>Choose a direction</legend>{directions.map((name, index) => <button type="button" key={name} aria-pressed={direction === index} onClick={() => setDirection(index)}><FileText size={15}/>{name}{direction === index && <Check size={14}/>}</button>)}</fieldset>
      <fieldset className="demo-palette"><legend>Make it yours</legend><div>{colors.map((item, index) => <button key={item.name} aria-label={`${item.name} palette`} aria-pressed={color === index} style={{ background: item.color }} onClick={() => setColor(index)}>{color === index && <Check size={14}/>}</button>)}</div><p>Same foundations.<br/>A different feeling.</p></fieldset>
    </aside><div className="demo-canvas" style={{ '--demo-accent': colors[color].color, '--demo-surface': colors[color].surface } as CSSProperties}>
      <div className={`demo-website demo-direction-${direction}`}><div className="demo-site-nav"><strong><span className="demo-symbol"/>northstar</strong><span>Features<span>Our story</span></span></div>
        <div className="demo-site-hero" key={direction}><div><h2>Less busywork.<br/>More good work.</h2><p>A calmer place to plan, share ideas, and move your next project forward.</p><span className="demo-site-action">Find your focus<ArrowRight size={14}/></span></div>
          {direction !== 2 && <div className="demo-project-board"><div><span className="demo-symbol"/>A little progress, every day.</div><strong>Website launch</strong><p>Make room for what matters.</p>{['Find the right direction', 'Make the details yours', 'Bring it all together'].map((item, index) => <div className="demo-task" key={item}><span className={index < 2 ? 'done' : ''}>{index < 2 && <Check size={11}/>}</span>{item}</div>)}<div className="demo-board-bottom"><span>Design team</span><span>2 of 3 complete</span></div></div>}
        </div><div className="demo-site-bottom"><span>One space for your next big thing.</span><span>Plan with purpose. Create with clarity.</span></div>
      </div>
    </div></div><div className="demo-caption"><MousePointer2 size={14}/>Try a direction or a color. Your actual project starts after signup.</div>
  </section>;
}

export function LandingPage() {
  return <><section className="public-hero"><div className="hero-atmosphere" aria-hidden="true"><span className="hero-blob hero-blob-one"/><span className="hero-blob hero-blob-two"/><span className="hero-blob hero-blob-three"/><svg className="hero-lines" viewBox="0 0 900 560" fill="none" preserveAspectRatio="none"><path d="M-40 350C120 90 270 80 400 260s260 210 540-110"/><path d="M-70 430C120 160 250 170 390 340s280 160 580-130"/><path d="M30 130c170 130 260 260 420 190s250-80 430 90"/></svg></div><div className="hero-copy"><span className="hero-kicker"><i/>A better place for your next idea</span><h1>Make the website<br/><em>you can see</em><br/>in your head.</h1><div className="hero-actions"><p>Clayface turns a first thought into a considered, connected website. Explore a few ways forward, then make the details yours.</p><Link className="public-button public-button-large" href={routes.signup}>Start creating<ArrowRight size={18}/></Link><Link className="public-text-link" href={routes.product}>See how it works<ArrowRight size={16}/></Link></div></div><div className="hero-scroll"><span>Scroll to explore</span><i/></div></section>
    <div className="public-demo-wrap"><ProductDemo/></div>
    <section className="public-workflow"><div><h2>A little structure.<br/>A lot of possibility.</h2><p>You bring the idea. Clayface gives you a connected set of pages and the room to make them your own.</p></div><ol><li><span>1</span><div><h3>Start with your idea</h3><p>Tell us what you’re making and who it’s for. Choose the pages your website needs.</p></div></li><li><span>2</span><div><h3>Find your direction</h3><p>Start product-led, editorial, or essential. Explore up to three compositions for your project.</p></div></li><li><span>3</span><div><h3>Make it feel like you</h3><p>Edit sections, adjust your design system, and preview your website at different sizes.</p></div></li></ol></section>
    <section className="public-close"><Palette size={32} strokeWidth={1.5}/><h2>Your next idea deserves<br/>a place to take shape.</h2><Link className="public-button public-button-large" href={routes.signup}>Create your account<ArrowRight size={18}/></Link></section></>;
}

export function ProductPage() {
  return <><section className="public-page-intro"><h1>From a first thought<br/>to a coherent website.</h1><p>One project. A shared design system. Room to explore different ways to tell your story.</p><Link className="public-button public-button-large" href={routes.signup}>Start your project<ArrowRight size={18}/></Link></section><div className="public-demo-wrap"><ProductDemo/></div><section className="public-details"><h2>Everything has a place.</h2><dl><div><dt>Pages with a purpose</dt><dd>Build with Home, Features, Pricing, About, and Contact page families. Start with what you need.</dd></div><div><dt>One shared design language</dt><dd>Set color, typography, spacing, and shape once. Apply your foundations across every direction.</dd></div><div><dt>Control over the details</dt><dd>Select sections, edit their content, change variants, and reorder within supported layouts. Undo and redo as you explore.</dd></div><div><dt>A workspace that remembers</dt><dd>Your project saves to your account. Preview your work and download a JSON backup. Code export and hosted publishing are not available yet.</dd></div></dl></section></>;
}

export function HelpPage() {
  return <section className="public-help"><div><h1>A little help<br/>along the way.</h1><p>Get set up, find your way around, and keep your work safe.</p><Link className="public-text-link" href={routes.dashboard}>Open your dashboard<ArrowRight size={16}/></Link></div><div className="public-questions">{[
    ['How do I start?', <>Create an account, enter your name, describe your project, and choose a starting direction. You’ll then arrive in your dashboard. If you leave during setup, signing in takes you back to your saved step.</>],
    ['Where is my project?', <>Sign in and open <Link href={routes.dashboard}>your dashboard</Link>. You have one active project with room for up to three design directions. The public homepage is separate from your private workspace.</>],
    ['Are my changes saved?', <>Edits save to your account. Check for “Saved to your account” before leaving. If another tab changes your project, download your current work before reloading to resolve the conflict.</>],
    ['Can I publish or export my website?', <>You can preview your website and download its workspace JSON from Project options. The JSON is a backup, not deployable website code. Next.js export and hosted publishing are still to come.</>],
    ['I forgot my password. What should I do?', <>Use <Link href="/forgot-password">Reset password</Link>. Reset links expire after 30 minutes and work once. In local development, messages are saved in the project’s .local-mail folder.</>],
    ['How do I protect my account?', <>Open account settings in your dashboard to change your password or enable two-factor authentication. Store the recovery codes somewhere safe; each code works once.</>],
  ].map(([question, answer]) => <details key={String(question)}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>;
}
