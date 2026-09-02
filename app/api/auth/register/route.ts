import { headers } from "next/headers";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { emailSchema, getRequestIp, nameSchema, normalizeEmail, passwordSchema } from "@/lib/auth-security";
import { prisma } from "@/lib/prisma";
import { authErrorResponse } from "@/lib/auth-errors";
import { recordRateLimitHit } from "@/lib/rate-limit";

const registerSchema = z
    .object({
        name: nameSchema.optional(),
        email: emailSchema,
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

        const json = await request.json();
        const parsed = registerSchema.safeParse(json);

        if (!parsed.success) {
            return authErrorResponse("INVALID_INPUT", 400, {
                detail: parsed.error.issues[0]?.message ?? "Invalid signup payload.",
            });
        }

        const email = normalizeEmail(parsed.data.email);
        const requestIp = getRequestIp(requestHeaders);
        const isRateLimited = await recordRateLimitHit(`register:${requestIp}:${email}`, 5, 15 * 60 * 1000);

        if (isRateLimited) {
            return authErrorResponse("SIGNUP_RATE_LIMITED", 429);
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                passwordHash: true,
                accounts: { select: { provider: true } },
            },
        });

        if (existingUser) {
            const hasGoogleAccount = existingUser.accounts.some((account: { provider: string }) => account.provider === "google");

            if (hasGoogleAccount && !existingUser.passwordHash) {
                return authErrorResponse("GOOGLE_ACCOUNT_ALREADY_EXISTS", 409);
            }

            if (!existingUser.passwordHash) {
                return authErrorResponse("OAUTH_ACCOUNT_ALREADY_EXISTS", 409);
            }

            return authErrorResponse("ACCOUNT_ALREADY_EXISTS", 409);
        }

        const passwordHash = await hash(parsed.data.password, 12);

        const user = await prisma.user.create({
            data: {
                name: parsed.data.name?.trim() || null,
                email,
                passwordHash,
            },
            select: {
                id: true,
            },
        });

        return NextResponse.json(
            { user },
            {
                status: 201,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("register route failed", error);

        const message = error instanceof Error ? error.message : "Failed to create account.";

        return authErrorResponse("SIGNUP_FAILED", 500, {
            detail: process.env.NODE_ENV === "production" ? undefined : message,
        });
    }
}
