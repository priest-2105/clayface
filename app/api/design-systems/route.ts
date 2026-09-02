import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import { getRequestIp } from "@/lib/auth-security";
import { designSystemReferenceSchema } from "@/lib/design-systems";
import { designSystemErrorResponse } from "@/lib/design-system-errors";
import { recordRateLimitHit } from "@/lib/rate-limit";

const sourceTypeMap = {
    figma: "FIGMA",
    link: "LINK",
    upload: "UPLOAD",
    other: "OTHER",
} as const;

export async function GET() {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        return designSystemErrorResponse("AUTH_REQUIRED", 401);
    }

    const references = await prisma.designSystemReference.findMany({
        where: { userId: session.user.id },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ references }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    try {
        const requestHeaders = await headers();
        const session = await getActiveSession();

        if (!session?.user?.id) {
            return designSystemErrorResponse("AUTH_REQUIRED", 401);
        }

        const origin = requestHeaders.get("origin");
        const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
        const protocol = requestHeaders.get("x-forwarded-proto") || "http";
        const secFetchSite = requestHeaders.get("sec-fetch-site");

        if (origin && host && origin !== `${protocol}://${host}`) {
            return designSystemErrorResponse("INVALID_INPUT", 403, { detail: "Blocked cross-origin request." });
        }

        if (secFetchSite === "cross-site") {
            return designSystemErrorResponse("INVALID_INPUT", 403, { detail: "Blocked cross-site request." });
        }

        const json = await request.json().catch(() => ({}));
        const parsed = designSystemReferenceSchema.safeParse(json);

        if (!parsed.success) {
            return designSystemErrorResponse("INVALID_INPUT", 400, {
                detail: parsed.error.issues[0]?.message ?? "Invalid design system payload.",
            });
        }

        const requestIp = getRequestIp(requestHeaders);

        if (await recordRateLimitHit(`design-system:${requestIp}:${session.user.id}`, 10, 15 * 60 * 1000)) {
            return designSystemErrorResponse("DESIGN_SYSTEM_RATE_LIMITED", 429);
        }

        const existing = await prisma.designSystemReference.findFirst({
            where: {
                userId: session.user.id,
                name: {
                    equals: parsed.data.name.trim(),
                    mode: "insensitive",
                },
            },
            select: { id: true },
        });

        if (existing) {
            return designSystemErrorResponse("DESIGN_SYSTEM_DUPLICATE_NAME", 409);
        }

        const sourceType = sourceTypeMap[parsed.data.sourceType];
        const shouldBePrimary = parsed.data.isPrimary ?? false;
        const existingCount = await prisma.designSystemReference.count({
            where: { userId: session.user.id },
        });

        const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            if (shouldBePrimary || existingCount === 0) {
                await tx.designSystemReference.updateMany({
                    where: { userId: session.user.id },
                    data: { isPrimary: false },
                });
            }

            return tx.designSystemReference.create({
                data: {
                    userId: session.user.id,
                    name: parsed.data.name.trim(),
                    description: parsed.data.description?.trim() || null,
                    sourceType,
                    sourceUrl: parsed.data.sourceUrl?.trim() || null,
                    figmaFileKey: parsed.data.figmaFileKey?.trim() || null,
                    figmaNodeId: parsed.data.figmaNodeId?.trim() || null,
                    notes: parsed.data.notes?.trim() || null,
                    isPrimary: shouldBePrimary || existingCount === 0,
                },
            });
        });

        return NextResponse.json(
            { reference: created },
            { status: 201, headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("design systems create route failed", error);
        return designSystemErrorResponse("DESIGN_SYSTEM_CREATE_FAILED", 500, {
            detail: error instanceof Error ? error.message : undefined,
        });
    }
}
