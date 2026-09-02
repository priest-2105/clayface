"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormField, FormLabel } from "@/components/ui/Form";
import { readAuthErrorMessage } from "@/lib/auth-errors";

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
            setError(readAuthErrorMessage(data, "Failed to disable account."));
            setSubmitting(false);
            return;
        }

        setSubmitting(false);
        await signOut({ callbackUrl: "/login?account=disabled" });
    }

    return (
        <Card className="border border-[var(--status-error)]/25 bg-[var(--status-error)]/6">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold tracking-tight text-[var(--status-error)]">
                    Disable account
                </CardTitle>
                <CardDescription>
                    This will deactivate your account and sign out every active session.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6" onSubmit={handleSubmit}>
                    {hasPassword && (
                        <FormField>
                            <FormLabel htmlFor="disable-current-password">
                                Current Password
                            </FormLabel>
                            <Input
                                id="disable-current-password"
                                type="password"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                required
                            />
                        </FormField>
                    )}
                    <FormField>
                        <FormLabel htmlFor="confirmText">
                            Type DISABLE to confirm
                        </FormLabel>
                        <Input
                            id="confirmText"
                            value={confirmText}
                            onChange={(event) => setConfirmText(event.target.value)}
                            placeholder="DISABLE"
                            required
                        />
                    </FormField>
                    {error && (
                        <Alert variant="error">
                            {error}
                        </Alert>
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
