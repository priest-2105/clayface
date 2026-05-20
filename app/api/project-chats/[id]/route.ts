import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Auth required." }, { status: 401 });
    }

    const { id } = await params;
    const chat = await prisma.projectChat.findFirst({
        where: {
            id,
            project: {
                userId: session.user.id,
            },
        },
        select: {
            id: true,
            title: true,
            summary: true,
            status: true,
            lastMessageAt: true,
            createdAt: true,
            updatedAt: true,
            project: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            messages: {
                orderBy: { createdAt: "asc" },
                select: {
                    id: true,
                    role: true,
                    content: true,
                    metadata: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!chat) {
        return NextResponse.json({ error: "Chat not found." }, { status: 404 });
    }

    type MessageRecord = (typeof chat.messages)[number];

    return NextResponse.json(
        {
            chat: {
                ...chat,
                lastMessageAt: chat.lastMessageAt?.toISOString() ?? null,
                createdAt: chat.createdAt.toISOString(),
                updatedAt: chat.updatedAt.toISOString(),
                messages: chat.messages.map((message: MessageRecord) => ({
                    ...message,
                    createdAt: message.createdAt.toISOString(),
                })),
            },
        },
        { headers: { "Cache-Control": "no-store" } }
    );
}
