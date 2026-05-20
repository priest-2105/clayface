import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import { getRequestIp, recordRateLimitHit } from "@/lib/auth-security";
import { projectCreateSchema, slugifyProjectName } from "@/lib/projects";

function serializeProject(project: {
    id: string;
    userId: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    accent: string | null;
    archivedAt: Date | null;
    lastOpenedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        chats: number;
        designs: number;
        references: number;
    };
    chats?: Array<{
        id: string;
        title: string;
        summary: string | null;
        status: string;
        lastMessageAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    references?: Array<{
        id: string;
        isPinned: boolean;
        sortOrder: number;
        designSystemReference: {
            id: string;
            name: string;
            sourceType: string;
            isPrimary: boolean;
        };
    }>;
}) {
    return {
        ...project,
        archivedAt: project.archivedAt?.toISOString() ?? null,
        lastOpenedAt: project.lastOpenedAt?.toISOString() ?? null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        chats: project.chats?.map((chat) => ({
            ...chat,
            lastMessageAt: chat.lastMessageAt?.toISOString() ?? null,
            createdAt: chat.createdAt.toISOString(),
            updatedAt: chat.updatedAt.toISOString(),
        })),
    };
}

async function getOwnedProjectCount(userId: string, slugBase: string) {
    return prisma.project.count({
        where: {
            userId,
            slug: {
                startsWith: slugBase,
            },
        },
    });
}

export async function GET() {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Auth required." }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
        where: { userId: session.user.id },
        orderBy: [{ lastOpenedAt: "desc" }, { updatedAt: "desc" }],
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
            chats: {
                orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
                take: 3,
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    status: true,
                    lastMessageAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            references: {
                orderBy: [{ isPinned: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
                take: 4,
                select: {
                    id: true,
                    isPinned: true,
                    sortOrder: true,
                    designSystemReference: {
                        select: {
                            id: true,
                            name: true,
                            sourceType: true,
                            isPrimary: true,
                        },
                    },
                },
            },
        },
    });

    return NextResponse.json({ projects: projects.map(serializeProject) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    try {
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

        const json = await request.json().catch(() => ({}));
        const parsed = projectCreateSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid project payload." },
                { status: 400 }
            );
        }

        const requestIp = getRequestIp(requestHeaders);

        if (recordRateLimitHit(`project:create:${requestIp}:${session.user.id}`, 15, 15 * 60 * 1000)) {
            return NextResponse.json({ error: "Too many project requests. Try again later." }, { status: 429 });
        }

        const slugBase = slugifyProjectName(parsed.data.name);
        const existingCount = await getOwnedProjectCount(session.user.id, slugBase);
        const slug = existingCount === 0 ? slugBase : `${slugBase}-${existingCount + 1}`;

        const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const project = await tx.project.create({
                data: {
                    userId: session.user.id,
                    name: parsed.data.name.trim(),
                    slug,
                    description: parsed.data.description?.trim() || null,
                    accent: parsed.data.accent?.trim() || null,
                    lastOpenedAt: new Date(),
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
                    _count: {
                        select: {
                            chats: true,
                            designs: true,
                            references: true,
                        },
                    },
                },
            });

            const starterChat = await tx.projectChat.create({
                data: {
                    projectId: project.id,
                    title: `${project.name} thread`,
                    summary: "Start this project with a reference-led brief.",
                    lastMessageAt: null,
                },
                select: {
                    id: true,
                    title: true,
                },
            });

            await tx.projectChatMessage.createMany({
                data: [
                    {
                        chatId: starterChat.id,
                        role: "USER",
                        content: `Start the ${project.name} project with a reference-led brief.`,
                        metadata: {
                            framework: "Next.js",
                            design: "Codex-style workspace",
                        },
                    },
                    {
                        chatId: starterChat.id,
                        role: "ASSISTANT",
                        content: "Project created and ready for reference-driven iterations.",
                        metadata: {
                            componentName: "ProjectShell",
                            files: ["project.config.ts", "workspace.tsx"],
                            description: "Initial workspace scaffold with project hierarchy and design references.",
                        },
                    },
                ],
            });

            await tx.projectActivity.createMany({
                data: [
                    {
                        projectId: project.id,
                        kind: "PROJECT_CREATED",
                        title: "Project created",
                        detail: project.name,
                    },
                    {
                        projectId: project.id,
                        chatId: starterChat.id,
                        kind: "CHAT_CREATED",
                        title: "Starter chat created",
                        detail: starterChat.title,
                    },
                ],
            });

            return { project, starterChat };
        });

        return NextResponse.json(
            {
                project: serializeProject(created.project),
                starterChatId: created.starterChat.id,
            },
            { status: 201, headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("project create route failed", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to create project.",
            },
            { status: 500 }
        );
    }
}
