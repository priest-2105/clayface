"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type ChatHeaderProps = {
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
};

export function ChatHeader({ sidebarOpen, onToggleSidebar }: ChatHeaderProps) {
    return (
        <header className="flex h-12 items-center justify-between gap-2 border-b border-border bg-card-bg px-3 transition-colors duration-300 ease-out md:px-4">
            <button
                type="button"
                onClick={onToggleSidebar}
                className="inline-flex h-8 items-center gap-2 rounded-[var(--r-1)] border border-border bg-background px-2.5 text-label-sm text-foreground transition-all duration-[160ms] ease-out hover:border-primary/60"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{sidebarOpen ? "Hide sidebar" : "Show sidebar"}</span>
            </button>
        </header>
    );
}
