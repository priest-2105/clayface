"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";

type ChatShellProps = {
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
    children: React.ReactNode;
};

export function ChatShell({ user, projects, children }: ChatShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="relative flex h-screen overflow-hidden bg-[#09090a]">
            <aside
                className={
                    sidebarOpen
                        ? "relative z-10 hidden md:flex md:w-[244px] md:opacity-100 md:translate-x-0 md:transition-[width,opacity,transform] md:duration-300 md:ease-out"
                        : "pointer-events-none hidden overflow-hidden md:flex md:w-0 md:opacity-0 md:-translate-x-2 md:transition-[width,opacity,transform] md:duration-300 md:ease-out"
                }
            >
                <ChatSidebar user={user} projects={projects} />
            </aside>

            <main className="relative z-10 flex min-w-0 flex-1 p-2 transition-[margin] duration-300 ease-out">
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-standard bg-bg-panel">
                    <ChatHeader
                        sidebarOpen={sidebarOpen}
                        onToggleSidebar={() => setSidebarOpen((current) => !current)}
                    />
                    {children}
                </div>
            </main>
        </div>
    );
}
