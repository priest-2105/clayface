import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { DisableAccountForm } from "@/components/auth/DisableAccountForm";

export default async function SettingsPage() {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/settings");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            image: true,
            passwordHash: true,
            createdAt: true,
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

    return (
        <div className="min-h-screen bg-background text-foreground px-6 py-10">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                        Account center
                    </p>
                    <h1 className="font-display text-4xl font-semibold tracking-tight">
                        Manage sign-in and security
                    </h1>
                    <p className="max-w-2xl text-text-secondary">
                        Update your password, manage your active account state, and control how you sign in.
                    </p>
                </div>

                <Card className="border border-blue-200/40 bg-white/50 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">{user.name || "Account"}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm text-text-secondary md:grid-cols-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.18em]">Password</p>
                            <p className="mt-1 text-foreground">
                                {user.passwordHash ? "Enabled" : "Not set"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.18em]">Google</p>
                            <p className="mt-1 text-foreground">
                                {hasGoogle ? "Connected" : "Not connected"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.18em]">Member since</p>
                            <p className="mt-1 text-foreground">
                                {user.createdAt.toLocaleDateString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <ChangePasswordForm hasPassword={Boolean(user.passwordHash)} />
                    <DisableAccountForm hasPassword={Boolean(user.passwordHash)} />
                </div>
            </div>
        </div>
    );
}
