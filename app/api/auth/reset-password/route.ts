import { headers } from "next/headers";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
    getRequestIp,
    hashPasswordResetToken,
    passwordSchema,
    recordRateLimitHit,
} from "@/lib/auth-security";
import { authErrorResponse } from "@/lib/auth-errors";

const resetSchema = z
    .object({
        token: z.string().min(32).max(256),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    });

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
        const parsed = resetSchema.safeParse(json);

        if (!parsed.success) {
            return authErrorResponse("INVALID_INPUT", 400, {
                detail: parsed.error.issues[0]?.message ?? "Invalid reset request.",
            });
        }

        const requestIp = getRequestIp(requestHeaders);

        if (recordRateLimitHit(`reset:${requestIp}`, 10, 15 * 60 * 1000)) {
            return authErrorResponse("RESET_RATE_LIMITED", 429);
        }

        const tokenHash = hashPasswordResetToken(parsed.data.token);
        const tokenRecord = await prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            select: {
                id: true,
                userId: true,
                expiresAt: true,
            },
        });

        if (!tokenRecord || tokenRecord.expiresAt.getTime() < Date.now()) {
            if (tokenRecord) {
                await prisma.passwordResetToken.delete({
                    where: { id: tokenRecord.id },
                });
            }

            return authErrorResponse("RESET_TOKEN_INVALID", 400);
        }

        const passwordHash = await hash(parsed.data.password, 12);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { passwordHash },
            }),
            prisma.session.deleteMany({
                where: { userId: tokenRecord.userId },
            }),
            prisma.passwordResetToken.deleteMany({
                where: { userId: tokenRecord.userId },
            }),
        ]);

        return NextResponse.json(
            { ok: true, message: "Password updated successfully." },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("reset-password route failed", error);
        return authErrorResponse("RESET_FAILED", 500, {
            detail: error instanceof Error ? error.message : undefined,
        });
    }
}
