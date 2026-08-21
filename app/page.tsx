import { LandingNav } from "@/components/LandingNav";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Layers, Code2 } from "lucide-react";
import Link from "next/link";

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
            <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-16">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-medium
                    bg-card-bg
                    border border-border
                    text-primary">
                    <Code2 className="w-3.5 h-3.5" strokeWidth={2} />
                    AI Frontend Compiler
                </div>

                <h1 className="font-heading font-semibold tracking-tight text-5xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.05] mb-6">
                    Build UI at the <span className="text-primary">speed of thought</span>
                </h1>

                <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10">
                    Describe any component or page. Choose your stack and design system.
                    Clayface compiles clean, typed, production-ready frontend code — instantly.
                </p>

                <div className="flex items-center gap-3 flex-wrap justify-center">
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

                {/* Preview card */}
                <div className="relative mt-20 w-full max-w-3xl">
                    <div className="relative rounded-2xl overflow-hidden
                        bg-card-bg
                        border border-border">

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
            <section className="relative py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="font-heading font-semibold text-3xl md:text-4xl tracking-tight mb-4">
                            Everything you need, nothing you don&apos;t
                        </h2>
                        <p className="text-text-secondary text-lg max-w-xl mx-auto">
                            Clayface is constrained by design — focused entirely on producing great frontend code.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {features.map((f) => (
                            <div key={f.title} className="flex flex-col gap-4 p-6 rounded-2xl
                                bg-card-bg
                                border border-border
                                transition-colors duration-[160ms]
                                hover:border-primary/60">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center
                                    bg-background
                                    border border-border">
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
            <section className="relative py-24 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="relative p-10 md:p-14 rounded-2xl overflow-hidden
                        bg-card-bg
                        border border-border">
                        <h2 className="relative font-heading font-semibold text-3xl md:text-4xl tracking-tight mb-4">
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
                    <span className="font-heading font-semibold text-foreground">Clayface</span>
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
