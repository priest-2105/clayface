import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { buildFigmaAuthorizationUrl, createFigmaOAuthState, FIGMA_STATE_COOKIE, isFigmaConfigured } from "@/lib/figma";
import { getSafeCallbackPath } from "@/lib/auth-security";
import { getActiveSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!isFigmaConfigured()) {
        return NextResponse.redirect(new URL("/chat?figma=missing-config", request.url));
    }

    const returnTo = getSafeCallbackPath(request.nextUrl.searchParams.get("returnTo"), "/chat");
    const state = createFigmaOAuthState();
    const cookieStore = await cookies();

    cookieStore.set(
        FIGMA_STATE_COOKIE,
        JSON.stringify({ state, returnTo }),
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 10,
        }
    );

    return NextResponse.redirect(buildFigmaAuthorizationUrl(state));
}
