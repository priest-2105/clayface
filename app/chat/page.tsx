import { redirect } from "next/navigation";
import { FolderOpen, MessageSquare, Plus } from "lucide-react";
import { FigmaOAuthCard } from "@/components/chat/FigmaOAuthCard";
import { ProjectCreateForm } from "@/components/chat/projects/ProjectCreateForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/clayface";
import { Badge } from "@/components/ui/Badge";
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
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex min-w-0 flex-1 overflow-y-auto">
                <div className="grid min-h-full w-full grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className="border-b border-border bg-card-bg p-5 xl:border-b-0 xl:border-r">
                        <div className="flex items-center justify-between gap-3 xl:block">
                            <div>
                                <h1 className="text-title-3 text-foreground">Workspace</h1>
                                <p className="mt-1 text-body-sm text-text-secondary">
                                    Projects, references, and generation threads.
                                </p>
                            </div>
                            <Badge variant="secondary" className="hidden sm:inline-flex xl:mt-4">
                                {projects.length} projects
                            </Badge>
                        </div>

                        <div className="mt-5 border-t border-border pt-5">
                            <div className="mb-3 flex items-center gap-2 text-label-sm text-text-secondary">
                                <Plus className="h-4 w-4" />
                                New project
                            </div>
                            <ProjectCreateForm />
                        </div>

                        <div className="mt-6">
                            <FigmaOAuthCard />
                        </div>
                    </aside>

                    <section className="min-w-0 bg-background">
                        <div className="flex h-14 items-center justify-between border-b border-border px-5">
                            <div className="flex min-w-0 items-center gap-2">
                                <FolderOpen className="h-4 w-4 shrink-0 text-text-tertiary" />
                                <h2 className="truncate text-subheading text-foreground">Projects</h2>
                            </div>
                            <div className="hidden items-center gap-4 text-caption text-text-tertiary md:flex">
                                <span>{projects.reduce((total, project) => total + project._count.chats, 0)} chats</span>
                                <span>{projects.reduce((total, project) => total + project._count.designs, 0)} designs</span>
                            </div>
                        </div>

                        {projects.length > 0 ? (
                            <div className="divide-y divide-border">
                                    {projects.map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            id={project.id}
                                            name={project.name}
                                            description={project.description}
                                            status={project.status}
                                            counts={{
                                                chats: project._count.chats,
                                                designs: project._count.designs,
                                                references: project._count.references,
                                            }}
                                            chats={project.chats}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <div className="p-5">
                                <EmptyState
                                    icon={<MessageSquare className="h-5 w-5" />}
                                    title="Create a project to start"
                                    description="Give Clayface a project name and brief. Chats, generated designs, and references will stay grouped there."
                                />
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
