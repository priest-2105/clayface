import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { getActiveSession, googleOAuthEnabled } from "@/lib/auth";

export default async function SignupPage() {
    const session = await getActiveSession();

    if (session) {
        redirect("/chat");
    }

    return <SignupForm googleOAuthEnabled={googleOAuthEnabled} />;
}
