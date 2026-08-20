import Link from "next/link";

const sections = [
    {
        title: "Information we collect",
        body: [
            "Account details such as your name, email address, and authentication provider.",
            "Content you submit to the app, including prompts, settings, and uploaded assets you choose to send.",
            "Usage data, device data, and logs that help us keep the product secure and reliable.",
        ],
    },
    {
        title: "How we use information",
        body: [
            "To provide authentication, save your work, and operate app features.",
            "To detect abuse, troubleshoot issues, and improve product quality.",
            "To send service-related messages such as password resets and security notices.",
        ],
    },
    {
        title: "Sharing",
        body: [
            "We do not sell your personal information.",
            "We may share data with service providers that help us run the product, such as authentication, database, and hosting providers.",
            "We may disclose information when required by law or to protect the security of the service.",
        ],
    },
    {
        title: "Your choices",
        body: [
            "You can update or delete account details where the product supports it.",
            "You can request account disablement from the settings page.",
            "You can ask us to remove data where applicable, subject to legal and operational requirements.",
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="dark min-h-screen bg-background text-foreground">
            <section className="relative overflow-hidden border-b border-blue-200/30 dark:border-blue-900/25">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-400/10 blur-[120px]" />
                    <div className="absolute -bottom-16 right-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-[120px]" />
                </div>
                <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-20">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-text-secondary">
                            Privacy Policy
                        </p>
                        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                            How Clayface handles your data
                        </h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-text-secondary">
                            Effective date: May 19, 2026. This page explains what data we collect, how we use it,
                            and the choices available to you when using Clayface.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
                        <Link href="/" className="text-primary hover:text-primary-hover underline-offset-4 hover:underline">
                            Home
                        </Link>
                        <Link href="/terms" className="text-primary hover:text-primary-hover underline-offset-4 hover:underline">
                            Terms of Service
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
                            className="rounded-3xl border border-blue-200/40 bg-white/50 p-6 shadow-sm backdrop-blur-xl dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]"
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

                <article className="mt-6 rounded-3xl border border-blue-200/40 bg-white/50 p-6 shadow-sm backdrop-blur-xl dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                    <h2 className="font-heading text-2xl font-semibold tracking-tight">Contact</h2>
                    <p className="mt-4 text-sm leading-6 text-text-secondary">
                        If you have questions about this policy, contact the site owner through the support channel
                        associated with your deployment.
                    </p>
                </article>
            </section>
        </main>
    );
}
