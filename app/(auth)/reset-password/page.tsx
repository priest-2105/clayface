import Link from "next/link";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { getActiveSession } from "@/lib/auth";
import { AUTH_ERROR_MESSAGES } from "@/lib/auth-errors";

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const session = await getActiveSession();

    if (session) {
        redirect("/chat/1");
    }

    const params = await searchParams;
    const token = typeof params.token === "string" ? params.token : "";

    if (!token) {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Invalid reset link</CardTitle>
                    <CardDescription>
                        {AUTH_ERROR_MESSAGES.INVALID_RESET_LINK}
                    </CardDescription>
                </CardHeader>
                <CardContent />
                <CardFooter>
                    <Link href="/forgot-password" className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline">
                        Request a new link
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return <ResetPasswordForm token={token} />;
}
