import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { getActiveSession } from "@/lib/auth";

export default async function SignupPage() {
    const session = await getActiveSession();

    if (session) {
        redirect("/chat/1");
    }

    return <SignupForm />;
}
