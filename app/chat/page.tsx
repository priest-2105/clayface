import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FolderOpen, Layers3, MessageSquare, Sparkles } from "lucide-react";
import { FigmaOAuthCard } from "@/components/chat/FigmaOAuthCard";
import { ProjectCreateForm } from "@/components/chat/projects/ProjectCreateForm";
import { Card } from "@/components/ui/Card";
import { getActiveSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ProjectRecord = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    accent: string | null;
    lastOpenedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        chats: number;
        designs: number;
        references: number;
    };
    chats: Array<{
        id: string;
        title: string;
        summary: string | null;
        status: string;
        lastMessageAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
};

export default async function ChatHomePage() {
    const session = await getActiveSession();

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/chat");
    }

    const projects = (await prisma.project.findMany({
        where: { userId: session.user.id },
        orderBy: [{ lastOpenedAt: "desc" }, { updatedAt: "desc" }],
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
        },
    })) as ProjectRecord[];

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <FigmaOAuthCard />

            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 py-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 px-3 py-1 text-xs font-medium text-text-secondary">
                                <FolderOpen className="h-3.5 w-3.5" />
                                Projects
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-semibold tracking-tight">Project hub</h1>
                                <p className="max-w-2xl text-sm leading-6 text-text-secondary">
                                    Create a project, attach chats and designs to it, and keep the work grounded in the right reference set.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-border bg-background/55 px-3 py-1 text-xs text-text-secondary">
                            <Sparkles className="h-3.5 w-3.5" />
                            Codex-style workspace hierarchy
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
                        <div className="space-y-4">
                            <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                <div className="border-b border-border px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                        New project
                                    </p>
                                </div>
                                <div className="p-4">
                                    <ProjectCreateForm />
                                </div>
                            </Card>

                            <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                <div className="border-b border-border px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                        Library stats
                                    </p>
                                </div>
                                <div className="grid gap-3 p-4 sm:grid-cols-3 xl:grid-cols-1">
                                    <StatTile label="Projects" value={String(projects.length)} />
                                    <StatTile label="Chats" value={String(projects.reduce((total, project) => total + project._count.chats, 0))} />
                                    <StatTile
                                        label="Designs"
                                        value={String(projects.reduce((total, project) => total + project._count.designs, 0))}
                                    />
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            {projects.length > 0 ? (
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <Card
                                            key={project.id}
                                            className="border border-border bg-card-bg/80 shadow-sm shadow-black/10 transition-colors hover:border-primary/20"
                                        >
                                            <div className="border-b border-border px-4 py-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h2 className="text-lg font-semibold tracking-tight">{project.name}</h2>
                                                            <span className="rounded-full border border-border bg-background/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                                                                {project.status}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-sm text-text-secondary">
                                                            {project.description || "No project description yet."}
                                                        </p>
                                                    </div>
                                                    <span className="rounded-full border border-border bg-background/55 px-3 py-1 text-[11px] text-text-secondary">
                                                        {project._count.references} references
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr]">
                                                <div className="space-y-3">
                                                    <div className="grid gap-2 sm:grid-cols-3">
                                                        <StatTile label="Chats" value={String(project._count.chats)} compact />
                                                        <StatTile label="Designs" value={String(project._count.designs)} compact />
                                                        <StatTile label="References" value={String(project._count.references)} compact />
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <Link
                                                            href={`/projects/${project.id}`}
                                                            className="inline-flex items-center gap-1 rounded-md border border-border bg-background/55 px-3 py-2 text-sm text-foreground transition-all duration-200 ease-out hover:border-primary/20 hover:bg-background/75"
                                                        >
                                                            Open project
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <Link
                                                            href="/settings?tab=design-systems"
                                                            className="inline-flex items-center gap-1 rounded-md border border-border bg-background/55 px-3 py-2 text-sm text-foreground transition-all duration-200 ease-out hover:border-primary/20 hover:bg-background/75"
                                                        >
                                                            Attach references
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl border border-border bg-background/55 p-4">
                                                    <div className="mb-3 flex items-center justify-between gap-2">
                                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                                                            Recent chats
                                                        </p>
                                                        <Link href={`/projects/${project.id}`} className="text-xs text-primary hover:underline">
                                                            View project
                                                        </Link>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {project.chats.length > 0 ? (
                                                            project.chats.map((chat) => (
                                                                <Link
                                                                    key={chat.id}
                                                                    href={`/chat/${chat.id}`}
                                                                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card-bg/70 px-3 py-2 transition-all duration-200 ease-out hover:border-primary/20 hover:bg-background/75"
                                                                >
                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-sm font-medium">{chat.title}</p>
                                                                        <p className="truncate text-[11px] text-text-secondary">
                                                                            {chat.summary || "No summary yet"}
                                                                        </p>
                                                                    </div>
                                                                    <MessageSquare className="h-4 w-4 shrink-0 text-text-secondary" />
                                                                </Link>
                                                            ))
                                                        ) : (
                                                            <div className="rounded-xl border border-dashed border-border px-3 py-6 text-sm text-text-secondary">
                                                                No chats yet. Create the first one from the project page.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border border-border bg-card-bg/80 shadow-sm shadow-black/10">
                                    <div className="p-6 text-center">
                                        <h2 className="text-lg font-semibold tracking-tight">No projects yet</h2>
                                        <p className="mt-2 text-sm text-text-secondary">
                                            Create your first project to start grouping chats, designs, and references.
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatTile({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
    return (
        <div className="rounded-xl border border-border bg-background/55 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-secondary">{label}</p>
            <p className={compact ? "mt-1 text-lg font-semibold" : "mt-1 text-2xl font-semibold"}>{value}</p>
        </div>
    );
}
