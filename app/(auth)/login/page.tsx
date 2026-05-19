import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getActiveSession } from "@/lib/auth";

export default async function LoginPage() {
    const session = await getActiveSession();

    if (session) {
        redirect("/chat/1");
    }

    return <LoginForm />;
}
