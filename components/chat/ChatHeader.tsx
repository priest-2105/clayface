"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Palette } from "lucide-react";

type ChatHeaderProps = {
    themeLabel: string;
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
};

export function ChatHeader({ themeLabel, sidebarOpen, onToggleSidebar }: ChatHeaderProps) {
    return (
        <header className="flex h-14 items-center justify-between gap-2 border-b border-border/80 bg-card-bg/72 px-4 backdrop-blur-xl transition-colors duration-300 ease-out md:px-6">
            <button
                type="button"
                onClick={onToggleSidebar}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background/40 px-3 text-xs font-medium text-foreground transition-all duration-200 ease-out hover:border-primary/25 hover:bg-primary/10"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                {sidebarOpen ? "Close sidebar" : "Open sidebar"}
            </button>

            <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium text-text-secondary">
                    <Palette className="mr-2 h-3.5 w-3.5" />
                    {themeLabel}
                </span>
                <Link
                    href="/settings?tab=appearance"
                    className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-all duration-200 ease-out hover:border-primary/25 hover:bg-primary/10"
                >
                    Appearance
                </Link>
            </div>
        </header>
    );
}
