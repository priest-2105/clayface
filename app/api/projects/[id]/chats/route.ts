import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import { projectChatCreateSchema } from "@/lib/projects";

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

    const chats = await prisma.projectChat.findMany({
        where: { projectId: project.id },
        orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
        select: {
            id: true,
            title: true,
            summary: true,
            status: true,
            lastMessageAt: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: { messages: true, designs: true },
            },
        },
    });

    type ChatRecord = (typeof chats)[number];

    return NextResponse.json(
        {
            chats: chats.map((chat: ChatRecord) => ({
                ...chat,
                lastMessageAt: chat.lastMessageAt?.toISOString() ?? null,
                createdAt: chat.createdAt.toISOString(),
                updatedAt: chat.updatedAt.toISOString(),
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
    const parsed = projectChatCreateSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid chat payload." },
            { status: 400 }
        );
    }

    const chat = await prisma.projectChat.create({
        data: {
            projectId: project.id,
            title: parsed.data.title.trim(),
            summary: parsed.data.summary?.trim() || null,
            status: "ACTIVE",
        },
        select: {
            id: true,
            title: true,
            summary: true,
            status: true,
            lastMessageAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    await prisma.projectChatMessage.createMany({
        data: [
            {
                chatId: chat.id,
                role: "USER",
                content: `Start: ${chat.title}`,
                metadata: {
                    framework: "Next.js",
                    design: "Reference-driven",
                },
            },
            {
                chatId: chat.id,
                role: "ASSISTANT",
                content: "Ready to iterate from the current project references.",
                metadata: {
                    componentName: "ChatStarter",
                    files: ["chat-thread.tsx"],
                    description: "Initial prompt acknowledgement for the new project chat.",
                },
            },
        ],
    });

    await prisma.projectActivity.create({
        data: {
            projectId: project.id,
            chatId: chat.id,
            kind: "CHAT_CREATED",
            title: "Chat created",
            detail: chat.title,
        },
    });

    return NextResponse.json(
        {
            chat: {
                ...chat,
                lastMessageAt: chat.lastMessageAt?.toISOString() ?? null,
                createdAt: chat.createdAt.toISOString(),
                updatedAt: chat.updatedAt.toISOString(),
            },
        },
        { status: 201, headers: { "Cache-Control": "no-store" } }
    );
}
