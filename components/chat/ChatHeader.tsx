"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type ChatHeaderProps = {
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
};

export function ChatHeader({ sidebarOpen, onToggleSidebar }: ChatHeaderProps) {
    return (
        <header className="flex h-14 items-center justify-between gap-2 border-b border-border bg-card-bg px-4 transition-colors duration-300 ease-out md:px-6">
            <button
                type="button"
                onClick={onToggleSidebar}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-all duration-[160ms] ease-out hover:border-primary/60"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                {sidebarOpen ? "Close sidebar" : "Open sidebar"}
            </button>
        </header>
    );
}
