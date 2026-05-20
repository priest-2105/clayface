import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import {
    projectDesignCreateSchema,
    projectDesignStatusValueMap,
    projectDesignTypeValueMap,
} from "@/lib/projects";

async function getOwnedProject(id: string, userId: string) {
    return prisma.project.findFirst({
        where: { id, userId },
        select: { id: true },
    });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Auth required." }, { status: 401 });
    }

    const { id } = await params;
    const project = await getOwnedProject(id, session.user.id);

    if (!project) {
        return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const designs = await prisma.projectDesign.findMany({
        where: { projectId: project.id },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        select: {
            id: true,
            title: true,
            description: true,
            designType: true,
            status: true,
            sourceFigmaFileKey: true,
            sourceFigmaNodeId: true,
            previewUrl: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            chatId: true,
        },
    });

    type DesignRecord = (typeof designs)[number];

    return NextResponse.json(
        {
            designs: designs.map((design: DesignRecord) => ({
                ...design,
                createdAt: design.createdAt.toISOString(),
                updatedAt: design.updatedAt.toISOString(),
            })),
        },
        { headers: { "Cache-Control": "no-store" } }
    );
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const requestHeaders = await headers();
    const session = await getActiveSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Auth required." }, { status: 401 });
    }

    const origin = requestHeaders.get("origin");
    const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") || "http";
    const secFetchSite = requestHeaders.get("sec-fetch-site");

    if (origin && host && origin !== `${protocol}://${host}`) {
        return NextResponse.json({ error: "Blocked cross-origin request." }, { status: 403 });
    }

    if (secFetchSite === "cross-site") {
        return NextResponse.json({ error: "Blocked cross-site request." }, { status: 403 });
    }

    const { id } = await params;
    const project = await getOwnedProject(id, session.user.id);

    if (!project) {
        return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const json = await request.json().catch(() => ({}));
    const parsed = projectDesignCreateSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid design payload." },
            { status: 400 }
        );
    }

    if (parsed.data.chatId) {
        const chat = await prisma.projectChat.findFirst({
            where: {
                id: parsed.data.chatId,
                projectId: project.id,
            },
            select: { id: true },
        });

        if (!chat) {
            return NextResponse.json({ error: "Chat not found in this project." }, { status: 404 });
        }
    }

    const design = await prisma.projectDesign.create({
        data: {
            projectId: project.id,
            chatId: parsed.data.chatId?.trim() || null,
            title: parsed.data.title.trim(),
            description: parsed.data.description?.trim() || null,
            designType: parsed.data.designType ? projectDesignTypeValueMap[parsed.data.designType] : undefined,
            status: parsed.data.status ? projectDesignStatusValueMap[parsed.data.status] : undefined,
            sourceFigmaFileKey: parsed.data.sourceFigmaFileKey?.trim() || null,
            sourceFigmaNodeId: parsed.data.sourceFigmaNodeId?.trim() || null,
            previewUrl: parsed.data.previewUrl?.trim() || null,
            notes: parsed.data.notes?.trim() || null,
        },
        select: {
            id: true,
            title: true,
            description: true,
            designType: true,
            status: true,
            sourceFigmaFileKey: true,
            sourceFigmaNodeId: true,
            previewUrl: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            chatId: true,
        },
    });

    await prisma.projectActivity.create({
        data: {
            projectId: project.id,
            designId: design.id,
            kind: "DESIGN_CREATED",
            title: "Design created",
            detail: design.title,
        },
    });

    return NextResponse.json(
        {
            design: {
                ...design,
                createdAt: design.createdAt.toISOString(),
                updatedAt: design.updatedAt.toISOString(),
            },
        },
        { status: 201, headers: { "Cache-Control": "no-store" } }
    );
}
