import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import { getRequestIp, recordRateLimitHit } from "@/lib/auth-security";
import { headers } from "next/headers";

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
            return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
        }

        if (secFetchSite === "cross-site") {
            return NextResponse.json({ error: "Cross-site requests are blocked." }, { status: 403 });
        }

        const session = await getActiveSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
        }

        const json = await request.json().catch(() => ({}));
        const parsed = disableAccountSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid account disable request." },
                { status: 400 }
            );
        }

        const requestIp = getRequestIp(requestHeaders);

        if (recordRateLimitHit(`disable-account:${requestIp}:${session.user.id}`, 4, 60 * 60 * 1000)) {
            return NextResponse.json(
                { error: "Too many disable attempts. Please try again later." },
                { status: 429 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, passwordHash: true, disabledAt: true },
        });

        if (!user || user.disabledAt) {
            return NextResponse.json({ error: "This account is unavailable." }, { status: 403 });
        }

        if (user.passwordHash) {
            if (!parsed.data.currentPassword) {
                return NextResponse.json({ error: "Current password is required." }, { status: 400 });
            }

            const isValid = await compare(parsed.data.currentPassword, user.passwordHash);

            if (!isValid) {
                return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
            }
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: {
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
    } catch {
        return NextResponse.json({ error: "Failed to disable account." }, { status: 500 });
    }
}
