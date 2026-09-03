import { redirect } from "next/navigation";
import { FolderOpen, MessageSquare } from "lucide-react";
import { FigmaOAuthCard } from "@/components/chat/FigmaOAuthCard";
import { ProjectCreateForm } from "@/components/chat/projects/ProjectCreateForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/clayface";
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

    const chatCount = projects.reduce((total, project) => total + project._count.chats, 0);
    const designCount = projects.reduce((total, project) => total + project._count.designs, 0);
    const referenceCount = projects.reduce((total, project) => total + project._count.references, 0);

    return (
        <div className="flex min-h-0 flex-1 overflow-y-auto bg-bg-panel">
            <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-5">
                <header className="mb-4 flex flex-col gap-3 border-b border-border-standard pb-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-title-3 text-foreground">Workspace</h1>
                        <p className="mt-1 max-w-2xl text-body-sm text-text-secondary">
                            Start a project, connect references, then generate production UI from the project thread.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-caption text-text-secondary">
                        <span>{projects.length} projects</span>
                        <span>{chatCount} chats</span>
                        <span>{designCount} designs</span>
                        <span>{referenceCount} references</span>
                    </div>
                </header>

                <section aria-labelledby="start-project" className="border-b border-border-standard pb-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <h2 id="start-project" className="text-subheading text-foreground">
                                Start
                            </h2>
                            <p className="text-caption text-text-secondary">
                                One brief creates the project shell and starter thread.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <FigmaOAuthCard />
                        </div>
                    </div>
                    <ProjectCreateForm />
                    <div className="mt-3 md:hidden">
                        <FigmaOAuthCard />
                    </div>
                </section>

                <section aria-labelledby="project-library" className="min-w-0 pt-5">
                    <div className="mb-2 flex h-10 items-center justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                            <FolderOpen className="h-4 w-4 shrink-0 text-text-tertiary" />
                            <h2 id="project-library" className="truncate text-subheading text-foreground">
                                Project library
                            </h2>
                        </div>
                    </div>

                    {projects.length > 0 ? (
                        <div className="overflow-hidden rounded-[var(--r-2)] border border-border-standard">
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
                        </div>
                    ) : (
                        <EmptyState
                            icon={<MessageSquare className="h-5 w-5" />}
                            title="Create a project to start"
                            description="Give Clayface a project name and brief. Chats, generated designs, and references will stay grouped there."
                                />
                    )}
                </section>
            </div>
        </div>
    );
}
