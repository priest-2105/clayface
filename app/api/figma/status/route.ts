import { NextResponse } from "next/server";
import { getValidFigmaAccessToken, isFigmaConfigured } from "@/lib/figma";
import { getActiveSession } from "@/lib/auth";

export async function GET() {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Auth required." }, { status: 401 });
    }

    if (!isFigmaConfigured()) {
        return NextResponse.json({
            configured: false,
            connected: false,
        });
    }

    const token = await getValidFigmaAccessToken();

    return NextResponse.json({
        configured: true,
        connected: Boolean(token),
        expiresAt: token?.expiresAt ?? null,
        scope: token?.scope ?? null,
        userId: token?.userId ?? null,
    });
}
