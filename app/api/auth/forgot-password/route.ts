import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    createPasswordResetToken,
    emailSchema,
    getRequestIp,
    normalizeEmail,
    recordRateLimitHit,
} from "@/lib/auth-security";
import { authErrorResponse } from "@/lib/auth-errors";

const GENERIC_SUCCESS = {
    ok: true,
    message: "If an account exists for that email, a reset link has been prepared.",
};

export async function POST(request: Request) {
    try {
        const requestHeaders = await headers();
        const secFetchSite = requestHeaders.get("sec-fetch-site");
        const origin = requestHeaders.get("origin");
        const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
        const protocol = requestHeaders.get("x-forwarded-proto") || "http";

        if (origin && host && origin !== `${protocol}://${host}`) {
            return authErrorResponse("INVALID_REQUEST_ORIGIN", 403);
        }

        if (secFetchSite === "cross-site") {
            return authErrorResponse("CROSS_SITE_BLOCKED", 403);
        }

        const json = await request.json().catch(() => ({}));
        const parsed = emailSchema.safeParse(json.email);

        if (!parsed.success) {
            return NextResponse.json(GENERIC_SUCCESS, { status: 200, headers: { "Cache-Control": "no-store" } });
        }

        const email = normalizeEmail(parsed.data);
        const requestIp = getRequestIp(requestHeaders);

        if (recordRateLimitHit(`forgot:${requestIp}:${email}`, 5, 15 * 60 * 1000)) {
            return authErrorResponse("FORGOT_RATE_LIMITED", 429);
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, passwordHash: true },
        });

        if (!user?.passwordHash) {
            return NextResponse.json(GENERIC_SUCCESS, { status: 200, headers: { "Cache-Control": "no-store" } });
        }

        const { rawToken, tokenHash } = createPasswordResetToken();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

        await prisma.$transaction([
            prisma.passwordResetToken.deleteMany({
                where: { userId: user.id },
            }),
            prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    tokenHash,
                    expiresAt,
                },
            }),
        ]);

        const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`;
        const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

        return NextResponse.json(
            process.env.NODE_ENV === "production"
                ? GENERIC_SUCCESS
                : { ...GENERIC_SUCCESS, resetUrl, expiresAt: expiresAt.toISOString() },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch {
        return authErrorResponse("FORGOT_FAILED", 500);
    }
}
