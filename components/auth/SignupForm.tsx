"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormField, FormLabel, FormSection } from "@/components/ui/Form";
import { PasswordField } from "@/components/auth/PasswordField";
import { getAuthErrorMessage, readAuthErrorMessage } from "@/lib/auth-errors";

type SignupFormProps = {
    googleOAuthEnabled: boolean;
};

export function SignupForm({ googleOAuthEnabled }: SignupFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(readAuthErrorMessage(data, "Failed to create account."));
            setSubmitting(false);
            return;
        }

        const result = await signIn("credentials", {
            email,
            password,
            callbackUrl: "/chat",
        });

        if (!result) {
            setSubmitting(false);
            return;
        }

        if (result.error) {
            setError(getAuthErrorMessage(result.error));
            setSubmitting(false);
            return;
        }

        window.location.assign(result.url || "/chat");
    }

    async function handleGoogleSignIn() {
        setGoogleSubmitting(true);
        setError(null);

        const result = await signIn("google", { callbackUrl: "/chat", redirect: false });

        if (!result) {
            setError("Google sign-up failed. Try again.");
            setGoogleSubmitting(false);
            return;
        }

        if (result.error) {
            setError(getAuthErrorMessage(result.error));
            setGoogleSubmitting(false);
            return;
        }

        window.location.assign(result.url || "/chat");
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                <CardDescription>
                    Choose how you want to create your account. Use Google for a faster start, or sign up with email and password.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {googleOAuthEnabled ? (
                    <FormSection className="space-y-3">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                                Continue With Google
                            </p>
                            <p className="text-sm text-text-secondary">
                                Create your account with Google and skip password setup.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignIn}
                            loading={googleSubmitting}
                            disabled={submitting}
                        >
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" viewBox="0 0 488 512">
                                <path
                                    fill="currentColor"
                                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                />
                            </svg>
                            {googleSubmitting ? "Connecting with Google..." : "Continue with Google"}
                        </Button>
                    </FormSection>
                ) : (
                    <FormSection className="text-sm text-text-secondary">
                        Google sign-up is not configured in this environment.
                    </FormSection>
                )}
                <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-3 text-text-secondary">Or sign up with email and password</span>
                    </div>
                </div>
                <form className="grid gap-6 rounded-[var(--r-2)] border border-border bg-card-bg p-4" onSubmit={handleSubmit}>
                    <FormField>
                        <FormLabel htmlFor="name">
                            Name
                        </FormLabel>
                        <Input id="name" type="text" placeholder="Clayface User" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                    </FormField>
                    <FormField>
                        <FormLabel htmlFor="email">
                            Email
                        </FormLabel>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            inputMode="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </FormField>
                    <PasswordField
                        id="password"
                        label="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={setPassword}
                        required
                    />
                    <PasswordField
                        id="confirm-password"
                        label="Confirm Password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        required
                    />
                    {error && (
                        <Alert variant="error">
                            {error}
                        </Alert>
                    )}
                    <Button className="w-full" disabled={submitting}>
                        {submitting ? "Creating account..." : "Create account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-text-secondary">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
