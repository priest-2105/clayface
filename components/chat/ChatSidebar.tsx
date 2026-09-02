"use client";

import Link from "next/link";
import { FolderOpen, MessageSquare, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SidebarProfileMenu } from "@/components/chat/SidebarProfileMenu";

type ChatSidebarProps = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    projects: Array<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        status: string;
        lastOpenedAt: Date | null;
        chats: Array<{
            id: string;
            title: string;
            summary: string | null;
            updatedAt: Date;
        }>;
    }>;
};

export function ChatSidebar({ user, projects }: ChatSidebarProps) {
    const pathname = usePathname();

    const recentChats = projects.flatMap((project) =>
        project.chats.slice(0, 1).map((chat) => ({
            id: chat.id,
            title: chat.title,
            date: project.name,
            summary: chat.summary,
        }))
    );

    return (
        <div className="flex h-screen w-[244px] flex-shrink-0 flex-col border-r border-border bg-card-bg transition-colors duration-300 ease-out">
            <div className="border-b border-border p-3">
                <Link
                    href="/chat"
                    className="inline-flex h-9 w-full items-center gap-2 rounded-[var(--r-1)] border border-[var(--accent-border)] bg-primary px-4 text-[14px] font-medium text-[var(--clay-porcelain)] shadow-[var(--shadow-button)] transition-transform duration-[120ms] ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <Plus className="h-4 w-4" />
                    New project
                </Link>
                <div className="mt-3 flex items-center gap-2 rounded-[var(--r-1)] border border-border bg-background px-3 py-2 text-label-sm text-text-tertiary">
                    <Search className="h-3.5 w-3.5" />
                    Search sessions
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                <div className="flex items-center gap-2 px-4 pb-2 text-micro text-text-tertiary">
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span>Recent sessions</span>
                </div>
                <div className="space-y-0.5 px-2">
                    {recentChats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={`/chat/${chat.id}`}
                            className={cn(
                                "flex items-center gap-3 rounded-[var(--r-1)] px-2 py-1.5 text-label-sm transition-colors duration-150 ease-out",
                                "text-text-secondary hover:bg-background",
                                pathname === `/chat/${chat.id}` && "bg-background text-foreground"
                            )}
                        >
                            <MessageSquare className="w-4 h-4 text-text-tertiary shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px]">{chat.title}</p>
                                <p className="truncate text-micro text-text-tertiary">{chat.date}</p>
                            </div>
                        </Link>
                    ))}
                    {recentChats.length === 0 && (
                        <div className="px-2 py-2 text-caption text-text-tertiary">
                            No sessions yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3">
                <SidebarProfileMenu user={user} />
            </div>
        </div>
    );
}
