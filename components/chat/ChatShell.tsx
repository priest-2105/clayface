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
    themeLabel: string;
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

export function ChatShell({ user, themeLabel, projects, children }: ChatShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="relative flex h-screen overflow-hidden bg-background">
            <div className="pointer-events-none absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-slate-400/10 blur-[120px] dark:bg-slate-500/8" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-400/8 blur-[100px] dark:bg-cyan-400/5" />
            <div className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 rounded-full bg-slate-300/6 blur-[80px] dark:bg-slate-400/4" />

            <aside
                className={
                    sidebarOpen
                        ? "relative z-10 hidden md:flex md:w-64 md:opacity-100 md:translate-x-0 md:transition-[width,opacity,transform] md:duration-300 md:ease-out"
                        : "pointer-events-none hidden overflow-hidden md:flex md:w-0 md:opacity-0 md:-translate-x-2 md:transition-[width,opacity,transform] md:duration-300 md:ease-out"
                }
            >
                <ChatSidebar user={user} projects={projects} />
            </aside>

            <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-300 ease-out">
                <ChatHeader
                    themeLabel={themeLabel}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen((current) => !current)}
                />
                {children}
            </main>
        </div>
    );
}
