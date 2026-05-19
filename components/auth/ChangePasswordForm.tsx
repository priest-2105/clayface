"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

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
            setError(typeof data?.error === "string" ? data.error : "Failed to change password.");
            setSubmitting(false);
            return;
        }

        setSuccess(typeof data?.message === "string" ? data.message : "Password updated successfully.");
        setSubmitting(false);
        await signOut({ callbackUrl: "/login?password-updated=1" });
    }

    return (
        <Card className="border border-blue-200/40 bg-white/40 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.28)]">
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
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none" htmlFor="currentPassword">
                                Current Password
                            </label>
                            <Input
                                id="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="newPassword">
                            New Password
                        </label>
                        <Input
                            id="newPassword"
                            type="password"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>
                    <p className="text-xs text-text-secondary">
                        Passwords must be at least 10 characters and include uppercase, lowercase, and a number.
                    </p>
                    {error && (
                        <p className="rounded-lg border border-red-300/40 bg-red-50/60 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="rounded-lg border border-blue-300/40 bg-blue-50/60 px-3 py-2 text-sm text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-100">
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
