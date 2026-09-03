import Link from "next/link";
import { ArrowRight, FileCode2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export type ProjectCardChat = {
    id: string;
    title: string;
    summary: string | null;
};

export interface ProjectCardProps {
    id: string;
    name: string;
    description?: string | null;
    status: string;
    counts: {
        chats: number;
        designs: number;
        references: number;
    };
    chats?: ProjectCardChat[];
}

export function ProjectCard({ id, name, description, status, counts, chats = [] }: ProjectCardProps) {
    return (
        <article className="group px-5 py-4 transition-colors hover:bg-[var(--surface-tint)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-subheading text-foreground">{name}</h2>
                        <Badge variant="outline" className="h-5 px-2 text-micro">
                            {status.toLowerCase()}
                        </Badge>
                    </div>
                    <p className="mt-1 max-w-3xl truncate text-body-sm text-text-secondary">
                        {description || "No brief added yet."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-caption text-text-tertiary">
                        <span className="inline-flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {counts.chats} chats
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <FileCode2 className="h-3.5 w-3.5" />
                            {counts.designs} designs
                        </span>
                        <span>{counts.references} references</span>
                    </div>

                    {chats.length > 0 && (
                        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                            {chats.slice(0, 2).map((chat) => (
                                <Link
                                    key={chat.id}
                                    href={`/chat/${chat.id}`}
                                    className="inline-flex min-w-0 max-w-72 items-center gap-2 rounded-[var(--r-1)] border border-border bg-transparent px-2.5 py-1.5 text-label-sm text-text-secondary transition-colors hover:border-primary/50 hover:bg-bg-panel hover:text-foreground"
                                >
                                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-text-tertiary" aria-hidden="true" />
                                    <span className="truncate">{chat.title}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Link
                        href="/settings?tab=design-systems"
                        className="inline-flex h-8 items-center rounded-[var(--r-1)] border border-border bg-transparent px-3 text-label-sm text-text-secondary transition-colors hover:border-primary/50 hover:bg-bg-panel hover:text-foreground"
                    >
                        References
                    </Link>
                    <Link
                        href={`/projects/${id}`}
                        className="inline-flex h-8 items-center gap-1 rounded-[var(--r-1)] border border-border bg-transparent px-3 text-label-sm text-foreground transition-colors hover:border-primary/60 hover:bg-bg-panel"
                    >
                        Open
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
