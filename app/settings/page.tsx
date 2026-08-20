import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { DisableAccountForm } from "@/components/auth/DisableAccountForm";
import { cn } from "@/lib/utils";
import { DesignSystemsManager } from "@/components/settings/DesignSystemsManager";
import { DashboardThemeSelector } from "@/components/settings/DashboardThemeSelector";
import { dashboardThemeFromDbValue, getDashboardThemeConfig } from "@/lib/dashboard-theme";

type SettingsTab =
    | "pages"
    | "general"
    | "appearance"
    | "account"
    | "design-systems"
    | "integrations"
    | "usage"
    | "billing"
    | "privacy";

const tabs: Array<{ id: SettingsTab; label: string }> = [
    { id: "pages", label: "Pages" },
    { id: "general", label: "General" },
    { id: "appearance", label: "Appearance" },
    { id: "account", label: "Account" },
    { id: "design-systems", label: "Design Systems" },
    { id: "integrations", label: "Integrations" },
    { id: "usage", label: "Usage" },
    { id: "billing", label: "Billing" },
    { id: "privacy", label: "Privacy" },
];

function isSettingsTab(value: string | undefined): value is SettingsTab {
    return Boolean(value) && tabs.some((tab) => tab.id === value);
}

export default async function SettingsPage({
    searchParams,
}: {
    searchParams?: Promise<{ tab?: string | string[] | undefined }>;
}) {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/settings");
    }

    const params = searchParams ? await searchParams : {};
    const tabValue = Array.isArray(params.tab) ? params.tab[0] : params.tab;
    const activeTab: SettingsTab = isSettingsTab(tabValue) ? tabValue : "general";

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            image: true,
            passwordHash: true,
            createdAt: true,
            dashboardTheme: true,
            accounts: {
                select: { provider: true },
            },
        },
    });

    if (!user) {
        redirect("/login?callbackUrl=/settings");
    }

    const providers = Array.from(new Set(user.accounts.map((account: { provider: string }) => account.provider)));
    const hasGoogle = providers.includes("google");
    const themeConfig = getDashboardThemeConfig(dashboardThemeFromDbValue(user.dashboardTheme));
    type DesignSystemReferenceRecord = {
        id: string;
        name: string;
        description: string | null;
        sourceType: string;
        sourceUrl: string | null;
        figmaFileKey: string | null;
        figmaNodeId: string | null;
        notes: string | null;
        isPrimary: boolean;
        createdAt: Date;
        updatedAt: Date;
    };

    const designSystemReferences = (
        await prisma.designSystemReference.findMany({
            where: { userId: session.user.id },
            orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
            select: {
                id: true,
                name: true,
                description: true,
                sourceType: true,
                sourceUrl: true,
                figmaFileKey: true,
                figmaNodeId: true,
                notes: true,
                isPrimary: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    ).map((reference: DesignSystemReferenceRecord) => ({
        ...reference,
        createdAt: reference.createdAt.toISOString(),
        updatedAt: reference.updatedAt.toISOString(),
    }));

    return (
        <div className={`${themeConfig.className} ${themeConfig.mode === "dark" ? "dark" : ""} min-h-screen bg-background px-4 py-6 text-foreground md:px-6 md:py-10`}>
            <div className="mx-auto flex w-full max-w-none flex-col gap-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                        Account center
                    </p>
                    <h1 className="font-display text-4xl font-semibold tracking-tight">
                        Manage your account
                    </h1>
                    <p className="max-w-2xl text-text-secondary">
                        Control profile details, sign-in methods, usage, billing, privacy, and design systems from one place.
                    </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
                    <aside className="xl:sticky xl:top-6 xl:self-start">
                        <div className="rounded-2xl border border-border bg-card-bg/80 p-3 shadow-sm shadow-black/10 backdrop-blur-xl">
                            <div className="px-3 py-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">Settings</p>
                                <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Account center</h2>
                            </div>
                            <nav className="mt-2 flex flex-col gap-1">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.id}
                                        href={`/settings?tab=${tab.id}`}
                                        className={cn(
                                            "rounded-xl px-3 py-2 text-sm transition-all duration-200 ease-out",
                                            activeTab === tab.id
                                                ? "border border-primary/20 bg-primary/10 text-primary"
                                                : "border border-transparent text-foreground hover:border-border hover:bg-background/55"
                                        )}
                                    >
                                        {tab.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    <main className="space-y-6">
                        {activeTab === "pages" && (
                            <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold tracking-tight">Pages</CardTitle>
                                    <CardDescription>Quick links to the key areas of the app.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-3 md:grid-cols-2">
                                    <Link href="/chat" className="rounded-xl border border-border bg-background/55 p-4 transition-all duration-200 ease-out hover:border-primary/20 hover:bg-background/75">
                                        <p className="font-medium">Dashboard</p>
                                        <p className="text-sm text-text-secondary">Open the authenticated workspace.</p>
                                    </Link>
                                    <Link href="/help" className="rounded-xl border border-border bg-background/55 p-4 transition-all duration-200 ease-out hover:border-primary/20 hover:bg-background/75">
                                        <p className="font-medium">Help</p>
                                        <p className="text-sm text-text-secondary">Get support and guidance.</p>
                                    </Link>
                                    <Link href="/settings?tab=design-systems" className="rounded-xl border border-border bg-background/55 p-4 transition-all duration-200 ease-out hover:border-primary/20 hover:bg-background/75">
                                        <p className="font-medium">Design Systems</p>
                                        <p className="text-sm text-text-secondary">Manage reference systems Clayface should follow.</p>
                                    </Link>
                                    <Link href="/privacy-policy" className="rounded-xl border border-border bg-background/55 p-4 transition-all duration-200 ease-out hover:border-primary/20 hover:bg-background/75">
                                        <p className="font-medium">Privacy Policy</p>
                                        <p className="text-sm text-text-secondary">Review how data is handled.</p>
                                    </Link>
                                    <Link href="/terms" className="rounded-xl border border-border bg-background/55 p-4 transition-all duration-200 ease-out hover:border-primary/20 hover:bg-background/75">
                                        <p className="font-medium">Terms</p>
                                        <p className="text-sm text-text-secondary">Read the service terms.</p>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "general" && (
                            <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold tracking-tight">General</CardTitle>
                                    <CardDescription>Basic profile and account details.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Name</p>
                                        <p className="mt-1 text-foreground">{user.name || "Account"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Email</p>
                                        <p className="mt-1 break-all text-foreground">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Member since</p>
                                        <p className="mt-1 text-foreground">{user.createdAt.toLocaleDateString()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "appearance" && <DashboardThemeSelector initialTheme={dashboardThemeFromDbValue(user.dashboardTheme)} />}

                        {activeTab === "account" && (
                            <div className="grid gap-6 lg:grid-cols-2">
                                <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold tracking-tight">Account status</CardTitle>
                                        <CardDescription>
                                            Password and sign-in method overview.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-3 text-sm text-text-secondary md:grid-cols-2">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.18em]">Password</p>
                                            <p className="mt-1 text-foreground">{user.passwordHash ? "Enabled" : "Not set"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.18em]">Google</p>
                                            <p className="mt-1 text-foreground">{hasGoogle ? "Connected" : "Not connected"}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <ChangePasswordForm hasPassword={Boolean(user.passwordHash)} />
                                <DisableAccountForm hasPassword={Boolean(user.passwordHash)} />
                            </div>
                        )}

                        {activeTab === "design-systems" && <DesignSystemsManager initialReferences={designSystemReferences} />}

                        {activeTab === "integrations" && (
                            <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold tracking-tight">Integrations</CardTitle>
                                    <CardDescription>Connected services and external accounts.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-xl border border-border bg-background/55 p-4">
                                        <p className="text-sm font-medium">Google</p>
                                        <p className="mt-1 text-sm text-text-secondary">
                                            {hasGoogle ? "Connected for sign-in." : "Not connected."}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-background/55 p-4">
                                        <p className="text-sm font-medium">Figma MCP</p>
                                        <p className="mt-1 text-sm text-text-secondary">
                                            Connect Figma from the dashboard to import design context, then attach design system references here.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "usage" && (
                            <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold tracking-tight">Usage</CardTitle>
                                    <CardDescription>Generation and activity metrics.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-xl border border-border bg-background/55 p-4">
                                        <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Projects</p>
                                        <p className="mt-1 text-2xl font-semibold">-</p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-background/55 p-4">
                                        <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Generations</p>
                                        <p className="mt-1 text-2xl font-semibold">-</p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-background/55 p-4">
                                        <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Storage</p>
                                        <p className="mt-1 text-2xl font-semibold">-</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "billing" && (
                            <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold tracking-tight">Billing</CardTitle>
                                    <CardDescription>Plan and invoice controls.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-text-secondary">
                                    <p>No billing plan is connected yet.</p>
                                    <p>Add plan management here when subscriptions are enabled.</p>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "privacy" && (
                            <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold tracking-tight">Privacy</CardTitle>
                                    <CardDescription>Data handling and account controls.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-text-secondary">
                                    <p>Your account can be disabled from the Account tab.</p>
                                    <p>Review the privacy policy for data collection and retention details.</p>
                                </CardContent>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
