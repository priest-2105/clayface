import { NextResponse } from "next/server";
import { clearStoredFigmaToken } from "@/lib/figma";
import { getActiveSession } from "@/lib/auth";
import { rejectCrossSiteRequest } from "@/lib/request-security";

export async function POST() {
    const blocked = await rejectCrossSiteRequest();

    if (blocked) {
        return blocked;
    }

    const session = await getActiveSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Auth required." }, { status: 401 });
    }

    await clearStoredFigmaToken();
    return NextResponse.json({ ok: true });
}
