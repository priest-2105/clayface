"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { PasswordField } from "@/components/auth/PasswordField";
import { readAuthErrorMessage } from "@/lib/auth-errors";

type ChangePasswordFormProps = {
    hasPassword: boolean;
};

export function ChangePasswordForm({ hasPassword }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const response = await fetch("/api/auth/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currentPassword: hasPassword ? currentPassword : undefined,
                newPassword,
                confirmPassword,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(readAuthErrorMessage(data, "Failed to change password."));
            setSubmitting(false);
            return;
        }

        setSuccess(typeof data?.message === "string" ? data.message : "Password updated successfully.");
        setSubmitting(false);
        await signOut({ callbackUrl: "/login?password-updated=1" });
    }

    return (
        <Card className="border border-border bg-card-bg ">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Change password</CardTitle>
                <CardDescription>
                    {hasPassword
                        ? "Update the password attached to this account. Other sessions will be signed out."
                        : "Set a password on this account so you can sign in with email and password too."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6" onSubmit={handleSubmit}>
                    {hasPassword && (
                        <PasswordField
                            id="currentPassword"
                            label="Current Password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={setCurrentPassword}
                            required
                        />
                    )}
                    <PasswordField
                        id="newPassword"
                        label="New Password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={setNewPassword}
                        required
                    />
                    <PasswordField
                        id="confirmPassword"
                        label="Confirm New Password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        required
                    />
                    <p className="text-xs text-text-secondary">
                        Passwords must be at least 10 characters and include uppercase, lowercase, and a number.
                    </p>
                    {error && (
                        <p className="rounded-[var(--r-1)] border border-[var(--status-error)]/25 bg-[var(--status-error)]/8 px-3 py-2 text-sm text-[var(--status-error)]">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
                            {success}
                        </p>
                    )}
                    <Button className="w-full" disabled={submitting}>
                        {submitting ? "Updating password..." : hasPassword ? "Update password" : "Set password"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter />
        </Card>
    );
}
