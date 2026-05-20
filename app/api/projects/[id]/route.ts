import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import { projectUpdateSchema, projectStatusValueMap } from "@/lib/projects";

async function getOwnedProject(id: string, userId: string) {
    return prisma.project.findFirst({
        where: { id, userId },
        select: {
            id: true,
            userId: true,
            name: true,
            slug: true,
            description: true,
            status: true,
            accent: true,
            archivedAt: true,
            lastOpenedAt: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    chats: true,
                    designs: true,
                    references: true,
                },
            },
        },
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

    return NextResponse.json({ project }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const parsed = projectUpdateSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid project payload." },
            { status: 400 }
        );
    }

    const updated = await prisma.project.update({
        where: { id: project.id },
        data: {
            name: parsed.data.name?.trim(),
            description: parsed.data.description === "" ? null : parsed.data.description?.trim(),
            accent: parsed.data.accent === "" ? null : parsed.data.accent?.trim(),
            status: parsed.data.status ? projectStatusValueMap[parsed.data.status] : undefined,
        },
        select: {
            id: true,
            userId: true,
            name: true,
            slug: true,
            description: true,
            status: true,
            accent: true,
            archivedAt: true,
            lastOpenedAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    await prisma.projectActivity.create({
        data: {
            projectId: project.id,
            kind: "PROJECT_UPDATED",
            title: "Project updated",
            detail: updated.name,
        },
    });

    return NextResponse.json({ project: updated }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Auth required." }, { status: 401 });
    }

    const { id } = await params;
    const project = await getOwnedProject(id, session.user.id);

    if (!project) {
        return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const archived = await prisma.project.update({
        where: { id: project.id },
        data: { archivedAt: new Date(), status: "ARCHIVED" },
        select: { id: true, archivedAt: true, status: true },
    });

    await prisma.projectActivity.create({
        data: {
            projectId: project.id,
            kind: "PROJECT_ARCHIVED",
            title: "Project archived",
            detail: project.name,
        },
    });

    return NextResponse.json({ project: archived }, { headers: { "Cache-Control": "no-store" } });
}
