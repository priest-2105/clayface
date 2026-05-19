"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

type DisableAccountFormProps = {
    hasPassword: boolean;
};

export function DisableAccountForm({ hasPassword }: DisableAccountFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const response = await fetch("/api/auth/disable-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currentPassword: hasPassword ? currentPassword : undefined,
                confirmText,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(typeof data?.error === "string" ? data.error : "Failed to disable account.");
            setSubmitting(false);
            return;
        }

        setSubmitting(false);
        await signOut({ callbackUrl: "/login?account=disabled" });
    }

    return (
        <Card className="border border-red-300/40 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/10">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-red-700 dark:text-red-200">
                    Disable account
                </CardTitle>
                <CardDescription>
                    This will deactivate your account and sign out every active session.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6" onSubmit={handleSubmit}>
                    {hasPassword && (
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none" htmlFor="disable-current-password">
                                Current Password
                            </label>
                            <Input
                                id="disable-current-password"
                                type="password"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="confirmText">
                            Type DISABLE to confirm
                        </label>
                        <Input
                            id="confirmText"
                            value={confirmText}
                            onChange={(event) => setConfirmText(event.target.value)}
                            placeholder="DISABLE"
                            required
                        />
                    </div>
                    {error && (
                        <p className="rounded-lg border border-red-300/40 bg-red-50/60 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                            {error}
                        </p>
                    )}
                    <Button className="w-full" variant="secondary" disabled={submitting}>
                        {submitting ? "Disabling account..." : "Disable account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter />
        </Card>
    );
}
