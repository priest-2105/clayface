import Link from "next/link";

const sections = [
    {
        title: "Using Clayface",
        body: [
            "You must provide accurate account information and keep your credentials secure.",
            "You are responsible for any content or prompts you submit.",
            "You may only use the service in compliance with applicable laws and the rights of others.",
        ],
    },
    {
        title: "Acceptable use",
        body: [
            "Do not attempt to abuse, disrupt, or reverse engineer the service.",
            "Do not upload unlawful, harmful, or infringing content.",
            "Do not attempt to access accounts, data, or systems you are not authorized to use.",
        ],
    },
    {
        title: "Third-party services",
        body: [
            "Clayface may depend on third-party providers such as authentication, database, Figma, and hosting services.",
            "Your use of those services may also be governed by their own terms and policies.",
        ],
    },
    {
        title: "Account suspension and termination",
        body: [
            "We may disable or terminate accounts that violate these terms or create risk for the service.",
            "You can also disable your account from the settings page.",
        ],
    },
];

export default function TermsPage() {
    return (
        <main className="dark min-h-screen bg-background text-foreground">
            <section className="relative overflow-hidden border-b border-border">
                <div className="pointer-events-none absolute inset-0">
                    
                </div>
                <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-20">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-text-secondary">
                            Terms of Service
                        </p>
                        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                            Rules for using Clayface
                        </h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-text-secondary">
                            Effective date: May 19, 2026. These terms govern your use of Clayface and the features
                            available through the app.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
                        <Link href="/" className="text-primary hover:text-primary-hover underline-offset-4 hover:underline">
                            Home
                        </Link>
                        <Link href="/privacy-policy" className="text-primary hover:text-primary-hover underline-offset-4 hover:underline">
                            Privacy Policy
                        </Link>
                        <Link href="/login" className="text-primary hover:text-primary-hover underline-offset-4 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-6 py-16">
                <div className="grid gap-6">
                    {sections.map((section) => (
                        <article
                            key={section.title}
                            className="rounded-3xl border border-border bg-card-bg p-6"
                        >
                            <h2 className="font-heading text-2xl font-semibold tracking-tight">{section.title}</h2>
                            <ul className="mt-4 grid gap-3 text-sm leading-6 text-text-secondary">
                                {section.body.map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>

                <article className="mt-6 rounded-3xl border border-border bg-card-bg p-6">
                    <h2 className="font-heading text-2xl font-semibold tracking-tight">Warranty disclaimer</h2>
                    <p className="mt-4 text-sm leading-6 text-text-secondary">
                        Clayface is provided as-is and as available. To the extent allowed by law, we disclaim implied
                        warranties and limit liability for indirect or consequential damages.
                    </p>
                </article>
            </section>
        </main>
    );
}
