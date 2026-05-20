import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import { designSystemErrorResponse } from "@/lib/design-system-errors";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

        const { id } = await params;
        const json = await request.json().catch(() => ({}));
        const isPrimary = Boolean(json?.isPrimary);

        const reference = await prisma.designSystemReference.findFirst({
            where: { id, userId: session.user.id },
            select: { id: true },
        });

        if (!reference) {
            return designSystemErrorResponse("DESIGN_SYSTEM_NOT_FOUND", 404);
        }

        if (isPrimary) {
            await prisma.$transaction([
                prisma.designSystemReference.updateMany({
                    where: { userId: session.user.id },
                    data: { isPrimary: false },
                }),
                prisma.designSystemReference.update({
                    where: { id },
                    data: { isPrimary: true },
                }),
            ]);
        }

        const updated = await prisma.designSystemReference.findUnique({
            where: { id },
        });

        return NextResponse.json({ reference: updated }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("design systems patch route failed", error);
        return designSystemErrorResponse("DESIGN_SYSTEM_UPDATE_FAILED", 500, {
            detail: error instanceof Error ? error.message : undefined,
        });
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getActiveSession();

        if (!session?.user?.id) {
            return designSystemErrorResponse("AUTH_REQUIRED", 401);
        }

        const { id } = await params;

        const reference = await prisma.designSystemReference.findFirst({
            where: { id, userId: session.user.id },
            select: { id: true, isPrimary: true },
        });

        if (!reference) {
            return designSystemErrorResponse("DESIGN_SYSTEM_NOT_FOUND", 404);
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.designSystemReference.delete({
                where: { id },
            });

            if (reference.isPrimary) {
                const nextPrimary = await tx.designSystemReference.findFirst({
                    where: { userId: session.user.id },
                    orderBy: [{ createdAt: "desc" }],
                    select: { id: true },
                });

                if (nextPrimary) {
                    await tx.designSystemReference.update({
                        where: { id: nextPrimary.id },
                        data: { isPrimary: true },
                    });
                }
            }
        });

        return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("design systems delete route failed", error);
        return designSystemErrorResponse("DESIGN_SYSTEM_DELETE_FAILED", 500, {
            detail: error instanceof Error ? error.message : undefined,
        });
    }
}
