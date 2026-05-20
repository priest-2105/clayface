import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getActiveSession } from "@/lib/auth";

export default async function ForgotPasswordPage() {
    const session = await getActiveSession();

    if (session) {
        redirect("/chat");
    }

    return <ForgotPasswordForm />;
}
