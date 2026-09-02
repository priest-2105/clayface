"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormDescription, FormField, FormLabel } from "@/components/ui/Form";
import { readAuthErrorMessage } from "@/lib/auth-errors";

type ResetPasswordFormProps = {
    token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                password,
                confirmPassword,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(readAuthErrorMessage(data, "Failed to reset password."));
            setSubmitting(false);
            return;
        }

        setSuccess("Password updated. Redirecting to sign in...");
        setSubmitting(false);
        setTimeout(() => {
            router.push("/login");
        }, 1200);
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Choose a new password</CardTitle>
                <CardDescription>
                    Set a new password for your account. This will sign out other active password sessions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6 rounded-[var(--r-2)] border border-border bg-card-bg p-4" onSubmit={handleSubmit}>
                    <FormField>
                        <FormLabel htmlFor="password">
                            New Password
                        </FormLabel>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </FormField>
                    <FormField>
                        <FormLabel htmlFor="confirmPassword">
                            Confirm Password
                        </FormLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </FormField>
                    <FormDescription>
                        Passwords must be at least 10 characters and include uppercase, lowercase, and a number.
                    </FormDescription>
                    {error && (
                        <Alert variant="error">
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="success">
                            {success}
                        </Alert>
                    )}
                    <Button className="w-full" disabled={submitting}>
                        {submitting ? "Updating password..." : "Reset password"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-text-secondary">
                    <Link href="/login" className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline">
                        Back to sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
