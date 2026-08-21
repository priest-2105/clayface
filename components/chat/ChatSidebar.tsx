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
        <div className="flex h-screen w-[244px] flex-shrink-0 flex-col border-r border-border bg-[#09090a] transition-colors duration-300 ease-out">
            <div className="border-b border-border p-4">
                <Button className="w-full justify-start gap-2" variant="primary">
                    <Plus className="h-4 w-4" />
                    New Project
                </Button>
                <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-[rgba(255,255,255,0.02)] px-3 py-2 text-[13px] text-text-tertiary">
                    <Search className="h-3.5 w-3.5" />
                    Search sessions
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                <div className="px-4 pb-2">
                    <h3 className="text-micro uppercase tracking-[0.08em] text-text-tertiary">
                        Sessions
                    </h3>
                </div>
                <div className="space-y-0.5 px-2">
                    {recentChats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={`/chat/${chat.id}`}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-2 py-1.5 text-[13px] transition-colors duration-150 ease-out",
                                "text-text-secondary hover:bg-[rgba(255,255,255,0.04)]",
                                pathname === `/chat/${chat.id}` && "bg-[rgba(255,255,255,0.07)] text-foreground"
                            )}
                        >
                            <MessageSquare className="w-4 h-4 text-text-tertiary shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px]">{chat.title}</p>
                                <p className="truncate text-micro text-text-tertiary">{chat.date}</p>
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
