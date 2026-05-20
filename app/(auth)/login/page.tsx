import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getActiveSession, googleOAuthEnabled } from "@/lib/auth";

export default async function LoginPage() {
    const session = await getActiveSession();

    if (session) {
        redirect("/chat");
    }

    return <LoginForm googleOAuthEnabled={googleOAuthEnabled} />;
}
