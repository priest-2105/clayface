"use client";

import Link from "next/link";
import { Plus, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
        <div className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-border/80 bg-card-bg/85 backdrop-blur-xl transition-colors duration-300 ease-out">
            <div className="border-b border-border/80 p-4">
                <Button className="w-full justify-start gap-2" variant="primary">
                    <Plus className="h-4 w-4" />
                    New Project
                </Button>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background/55 px-3 py-2 text-xs text-text-secondary">
                    <Search className="h-3.5 w-3.5" />
                    Search sessions
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                <div className="px-4 pb-2">
                    <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-text-secondary">
                        Sessions
                    </h3>
                </div>
                <div className="space-y-1 px-2">
                    {recentChats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={`/chat/${chat.id}`}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ease-out",
                                "text-foreground hover:bg-background/60 hover:translate-x-0.5",
                                pathname === `/chat/${chat.id}` && "border border-primary/20 bg-primary/10"
                            )}
                        >
                            <MessageSquare className="w-4 h-4 text-text-secondary shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm">{chat.title}</p>
                                <p className="truncate text-[11px] text-text-secondary">{chat.date}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="p-3">
                <SidebarProfileMenu user={user} />
            </div>
        </div>
    );
}
