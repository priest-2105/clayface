import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowRight, MessageSquare, Shapes } from "lucide-react";
import { getActiveSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectChatCreateForm } from "@/components/projects/ProjectChatCreateForm";
import { ProjectDesignCreateForm } from "@/components/projects/ProjectDesignCreateForm";
import { ActivityTimeline, MetricTile, ProjectHeader, StatusPill } from "@/components/clayface";

type ProjectPageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/chat");
    }

    const { id } = await params;

    const project = await prisma.project.findFirst({
        where: { id, userId: session.user.id },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            status: true,
            accent: true,
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
            designs: {
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
            },
            references: {
                orderBy: [{ isPinned: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
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
            activities: {
                orderBy: [{ createdAt: "desc" }],
                take: 8,
                select: {
                    id: true,
                    kind: true,
                    title: true,
                    detail: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!project) {
        notFound();
    }

    type ProjectChatRecord = (typeof project.chats)[number];
    type ProjectDesignRecord = (typeof project.designs)[number];
    type ProjectReferenceRecord = (typeof project.references)[number];
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 overflow-y-auto px-6 py-6">
                <ProjectHeader name={project.name} description={project.description} status={project.status} />

                <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
                    <div className="space-y-4">
                        <Card className="border border-border bg-card-bg">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                    Project summary
                                </p>
                            </div>
                            <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
                                <MetricTile label="Status" value={project.status} compact />
                                <MetricTile label="Chats" value={project._count.chats} compact />
                                <MetricTile label="Designs" value={project._count.designs} compact />
                                <MetricTile label="References" value={project._count.references} compact />
                            </div>
                        </Card>

                        <Card className="border border-border bg-card-bg">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                    Create chat
                                </p>
                            </div>
                            <div className="p-4">
                                <ProjectChatCreateForm projectId={project.id} />
                            </div>
                        </Card>

                        <Card className="border border-border bg-card-bg">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                    Create design
                                </p>
                            </div>
                            <div className="p-4">
                                <ProjectDesignCreateForm projectId={project.id} />
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border border-border bg-card-bg">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                    Activity timeline
                                </p>
                            </div>
                            <div className="p-4">
                                <ActivityTimeline items={project.activities} />
                            </div>
                        </Card>

                        <Card className="border border-border bg-card-bg">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                    Chats
                                </p>
                            </div>
                            <div className="divide-y divide-border">
                                {project.chats.length > 0 ? (
                                    project.chats.map((chat: ProjectChatRecord) => (
                                        <Link
                                            key={chat.id}
                                            href={`/chat/${chat.id}`}
                                            className="flex items-center gap-4 px-4 py-4 transition-all duration-200 ease-out hover:bg-background"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                                                <MessageSquare className="h-4 w-4 text-text-secondary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="truncate text-sm font-semibold">{chat.title}</h2>
                                                    <StatusPill value={chat.status} className="h-5 text-[10px] uppercase tracking-[0.14em]" />
                                                </div>
                                                <p className="truncate text-sm text-text-secondary">{chat.summary || "No summary yet."}</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-text-secondary" />
                                        </Link>
                                    ))
                                ) : (
                                    <EmptyState
                                        className="m-4 min-h-40"
                                        title="No chats yet"
                                        description="Create the first thread from the sidebar form."
                                    />
                                )}
                            </div>
                        </Card>

                        <Card className="border border-border bg-card-bg">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                    Designs
                                </p>
                            </div>
                            <div className="divide-y divide-border">
                                {project.designs.length > 0 ? (
                                    project.designs.map((design: ProjectDesignRecord) => (
                                        <div key={design.id} className="px-4 py-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="text-sm font-semibold">{design.title}</h2>
                                                        <StatusPill value={design.status} className="h-5 text-[10px] uppercase tracking-[0.14em]" />
                                                    </div>
                                                    <p className="mt-1 text-sm text-text-secondary">
                                                        {design.description || "No description yet."}
                                                    </p>
                                                </div>
                                                <div className="inline-flex items-center gap-2 text-xs text-text-secondary">
                                                    <Shapes className="h-4 w-4" />
                                                    {design.designType}
                                                </div>
                                            </div>
                                            {(design.sourceFigmaFileKey || design.sourceFigmaNodeId) && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {design.sourceFigmaFileKey && (
                                                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-text-secondary">
                                                            File: {design.sourceFigmaFileKey}
                                                        </span>
                                                    )}
                                                    {design.sourceFigmaNodeId && (
                                                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-text-secondary">
                                                            Node: {design.sourceFigmaNodeId}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        className="m-4 min-h-40"
                                        title="No designs yet"
                                        description="Use the form to store a page, component, or flow generated for this project."
                                    />
                                )}
                            </div>
                        </Card>

                        <Card className="border border-border bg-card-bg">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                    Attached references
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 p-4">
                                {project.references.length > 0 ? (
                                    project.references.map((reference: ProjectReferenceRecord) => (
                                        <span
                                            key={reference.id}
                                            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                                        >
                                            {reference.designSystemReference.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-text-secondary">
                                        No design system references attached to this project yet.
                                    </span>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
