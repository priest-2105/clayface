import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import { getRequestIp } from "@/lib/auth-security";
import { headers } from "next/headers";
import { authErrorResponse } from "@/lib/auth-errors";
import { recordRateLimitHit } from "@/lib/rate-limit";

const disableAccountSchema = z.object({
    currentPassword: z.string().max(128).optional(),
    confirmText: z.literal("DISABLE"),
});

export async function POST(request: Request) {
    try {
        const requestHeaders = await headers();
        const origin = requestHeaders.get("origin");
        const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
        const protocol = requestHeaders.get("x-forwarded-proto") || "http";
        const secFetchSite = requestHeaders.get("sec-fetch-site");

        if (origin && host && origin !== `${protocol}://${host}`) {
            return authErrorResponse("INVALID_REQUEST_ORIGIN", 403);
        }

        if (secFetchSite === "cross-site") {
            return authErrorResponse("CROSS_SITE_BLOCKED", 403);
        }

        const session = await getActiveSession();

        if (!session?.user?.id) {
            return authErrorResponse("AUTH_REQUIRED", 401);
        }

        const json = await request.json().catch(() => ({}));
        const parsed = disableAccountSchema.safeParse(json);

        if (!parsed.success) {
            return authErrorResponse("INVALID_INPUT", 400, {
                detail: parsed.error.issues[0]?.message ?? "Invalid account disable request.",
            });
        }

        const requestIp = getRequestIp(requestHeaders);

        if (await recordRateLimitHit(`disable-account:${requestIp}:${session.user.id}`, 4, 60 * 60 * 1000)) {
            return authErrorResponse("DISABLE_ACCOUNT_RATE_LIMITED", 429);
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, passwordHash: true, disabledAt: true },
        });

        if (!user || user.disabledAt) {
            return authErrorResponse("ACCOUNT_UNAVAILABLE", 403);
        }

        if (user.passwordHash) {
            if (!parsed.data.currentPassword) {
                return authErrorResponse("CURRENT_PASSWORD_REQUIRED", 400);
            }

            const isValid = await compare(parsed.data.currentPassword, user.passwordHash);

            if (!isValid) {
                return authErrorResponse("CURRENT_PASSWORD_INCORRECT", 400);
            }
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: {
                    authVersion: {
                        increment: 1,
                    },
                    disabledAt: new Date(),
                    disabledReason: "User requested account disablement.",
                },
            }),
            prisma.session.deleteMany({
                where: { userId: user.id },
            }),
            prisma.passwordResetToken.deleteMany({
                where: { userId: user.id },
            }),
        ]);

        return NextResponse.json(
            { ok: true, message: "Account disabled successfully." },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("disable-account route failed", error);
        return authErrorResponse("DISABLE_ACCOUNT_FAILED", 500, {
            detail: error instanceof Error ? error.message : undefined,
        });
    }
}
