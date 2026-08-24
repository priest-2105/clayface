import { LandingNav } from "@/components/LandingNav";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Layers, Code2 } from "lucide-react";
import Link from "next/link";
import { HeroVideo } from "@/components/HeroVideo";

const features = [
    {
        icon: <Zap className="w-5 h-5 text-primary" strokeWidth={2} />,
        title: "Instant generation",
        description:
            "Describe a component or full page in plain English. Get clean, typed code in seconds — no boilerplate, no setup.",
    },
    {
        icon: <Layers className="w-5 h-5 text-primary" strokeWidth={2} />,
        title: "Stack-aware output",
        description:
            "Choose Next.js, React, or HTML/JS. Pick your design system — Shadcn UI, Material UI, or none. Clayface respects your decisions.",
    },
    {
        icon: <Code2 className="w-5 h-5 text-primary" strokeWidth={2} />,
        title: "Production-ready code",
        description:
            "No throwaway prototypes. Every output is structured, accessible, and follows the conventions of your chosen stack.",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
            <LandingNav />

            {/* ── Hero ── */}
            <section className="relative isolate h-[80vh] min-h-[560px] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-16 pb-16 overflow-hidden">
                {/* The video IS the background — full bleed, fully visible, looping.
                    Its own composition leaves the left two-thirds as flat, light negative
                    space, which is exactly where the copy sits, so no heavy scrim is
                    needed to keep it legible — just a light near-edge fade for safety
                    at odd crop widths. */}
                <HeroVideo
                    src="/video/clayface-morph.webm"
                    className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center]"
                />
                <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(246,243,238,0.55) 0%, rgba(246,243,238,0.2) 22%, transparent 40%)",
                    }}
                />

                <div className="relative w-full max-w-7xl mx-auto">
                    <div className="max-w-xl min-w-0">
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-6xl xl:text-7xl leading-[1.03] tracking-[-0.015em] mb-6">
                            Build UI at the <span className="text-primary">speed of thought</span>
                        </h1>

                        <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10">
                            Describe any component or page. Choose your stack and design system.
                            Clayface compiles clean, typed, production-ready frontend code — instantly.
                        </p>

                        <div className="flex items-center gap-3 flex-wrap mb-10">
                            <Link href="/chat">
                                <Button size="lg" variant="primary" className="gap-2 px-7">
                                    Start building free
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="px-7">
                                    Sign in
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-text-secondary">
                            <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                Free to start
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Preview card ── */}
            <section className="relative isolate px-6 md:px-12 lg:px-20 pt-16 pb-8 overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{ background: "radial-gradient(560px circle at 50% 20%, rgba(117,96,74,0.08), transparent 70%)" }}
                />
                <div className="relative w-full max-w-3xl mx-auto animate-imprint" style={{ animationDelay: "120ms" }}>
                    <div className="relative rounded-2xl overflow-hidden
                        bg-card-bg
                        border border-border
                        shadow-[var(--shadow-float)]">

                        {/* Window chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                            <div className="w-3 h-3 rounded-full bg-border" />
                            <div className="w-3 h-3 rounded-full bg-border" />
                            <div className="w-3 h-3 rounded-full bg-border" />
                            <span className="ml-3 text-xs text-text-secondary font-mono">clayface.ai / chat</span>
                        </div>

                        {/* Chat UI mock */}
                        <div className="p-6 flex flex-col gap-4 text-left">
                            {/* Prompt */}
                            <div className="flex flex-col gap-2 p-4 rounded-xl
                                bg-background
                                border border-border">
                                <p className="text-sm text-text-secondary">Describe your component...</p>
                                <p className="text-sm text-foreground font-medium">
                                    A pricing table with 3 tiers — Free, Pro, and Enterprise — using Shadcn UI cards with a highlighted &quot;Pro&quot; tier.
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex gap-2">
                                        <span className="px-2.5 py-1 rounded-md text-xs bg-card-bg text-primary border border-border">Next.js</span>
                                        <span className="px-2.5 py-1 rounded-md text-xs bg-card-bg text-primary border border-border">Shadcn UI</span>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Generated code preview */}
                            <div className="rounded-xl overflow-hidden border border-border">
                                <div className="flex items-center justify-between px-4 py-2 bg-background border-b border-border">
                                    <span className="text-xs font-mono text-text-secondary">PricingTable.tsx</span>
                                    <span className="text-xs text-primary">Generated</span>
                                </div>
                                <div className="px-4 py-3 font-mono text-xs leading-relaxed text-left bg-card-bg overflow-hidden max-h-28">
                                    <span className="text-primary">export default </span>
                                    <span className="text-foreground">{"function "}</span>
                                    <span className="text-foreground">PricingTable</span>
                                    <span className="text-foreground">{"() {"}</span>
                                    <br />
                                    <span className="text-foreground pl-4">{"  return ("}</span>
                                    <br />
                                    <span className="text-foreground pl-8">{"    "}</span>
                                    <span className="text-primary">{"<"}</span>
                                    <span className="text-foreground">{"div "}</span>
                                    <span className="text-text-secondary">{"className"}</span>
                                    <span className="text-foreground">{"="}</span>
                                    <span className="text-foreground">{'"grid grid-cols-3 gap-6"'}</span>
                                    <span className="text-primary">{">"}</span>
                                    <br />
                                    <span className="text-text-secondary pl-8 italic">{"      {/* Free, Pro, Enterprise tiers */}"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="relative py-28 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="block mb-4 text-xs font-mono uppercase tracking-[0.2em] text-primary">
                            Why Clayface
                        </span>
                        <h2 className="font-heading font-semibold text-3xl md:text-4xl tracking-tight mb-4">
                            Everything you need, nothing you don&apos;t
                        </h2>
                        <p className="text-text-secondary text-lg max-w-xl mx-auto">
                            Clayface is constrained by design — focused entirely on producing great frontend code.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div key={f.title} className="relative flex flex-col gap-4 p-6 rounded-2xl
                                bg-card-bg
                                border border-border
                                transition-colors duration-160
                                hover:border-primary/60
                                animate-imprint"
                                style={{ animationDelay: `${i * 90}ms` }}>
                                <span className="absolute top-5 right-5 font-mono text-[11px] text-text-secondary/50">
                                    0{i + 1}
                                </span>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center
                                    bg-background
                                    border border-border
                                    shadow-[inset_0_1px_2px_var(--inset-light)]">
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 className="font-heading font-medium text-base mb-1.5">{f.title}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA banner ── */}
            <section className="relative isolate py-28 px-6 overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{ background: "radial-gradient(640px circle at 50% 40%, rgba(117,96,74,0.10), transparent 70%)" }}
                />
                <div className="max-w-2xl mx-auto text-center">
                    <div className="relative isolate p-10 md:p-14 rounded-2xl overflow-hidden
                        bg-card-bg
                        border border-border
                        shadow-[var(--shadow-float)]">
                        <img
                            src="/images/dry.jfif"
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.07]"
                        />
                        <h2 className="relative font-display text-4xl md:text-5xl tracking-tight mb-4">
                            Start building today
                        </h2>
                        <p className="relative text-text-secondary text-lg mb-8">
                            No setup, no configuration. Just describe what you want to build.
                        </p>
                        <Link href="/chat">
                            <Button size="lg" variant="primary" className="gap-2 px-8">
                                Open Clayface
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative border-t border-border py-8 px-6">
                <div className="max-w-5xl mx-auto flex flex-col gap-3 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
                    <span className="flex items-center gap-2 font-heading font-semibold text-foreground">
                        <img src="/brand/logo-filled.svg" alt="" aria-hidden="true" className="h-4 w-4" />
                        Clayface
                    </span>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <span>&copy; {new Date().getFullYear()} Clayface AI. All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
