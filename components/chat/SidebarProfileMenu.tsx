"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronUp, Languages, LogOut, Settings, LifeBuoy, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

type SidebarProfileMenuProps = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
};

const languageOptions = [
    { code: "en", label: "English" },
    { code: "es", label: "Espanol" },
    { code: "fr", label: "French" },
] as const;

type LanguageCode = (typeof languageOptions)[number]["code"];

function getInitials(name?: string | null, email?: string | null) {
    return (name || email || "SU")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function SidebarProfileMenu({ user }: SidebarProfileMenuProps) {
    const [open, setOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState<LanguageCode>("en");
    const menuRef = useRef<HTMLDivElement>(null);
    const initials = getInitials(user.name, user.email);

    useEffect(() => {
        const stored = localStorage.getItem("shiva-language");
        if (stored === "en" || stored === "es" || stored === "fr") {
            setLanguage(stored);
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
                setLanguageOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateLanguage = (next: LanguageCode) => {
        setLanguage(next);
        localStorage.setItem("shiva-language", next);
        setLanguageOpen(false);
        setOpen(false);
    };

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-haspopup="menu"
                aria-expanded={open}
                className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                    "bg-white/55 dark:bg-[rgba(4,16,45,0.7)]",
                    "hover:bg-blue-100/70 dark:hover:bg-blue-950/55",
                    "border border-blue-200/40 dark:border-blue-800/30"
                )}
            >
                <Avatar className="h-10 w-10">
                    {user.image ? <AvatarImage src={user.image} alt={user.name || user.email || "User avatar"} /> : null}
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{user.name || "Shiva User"}</p>
                    <p className="truncate text-xs text-text-secondary">Profile and preferences</p>
                </div>
                <ChevronUp className={cn("h-4 w-4 text-text-secondary transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <div className="absolute bottom-full mb-2 w-full rounded-2xl border border-blue-200/40 bg-white/80 p-2 shadow-xl shadow-blue-900/10 backdrop-blur-2xl dark:border-blue-800/40 dark:bg-[rgba(4,16,45,0.92)]">
                    <Link
                        href="/settings?tab=account"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-blue-100/70 dark:hover:bg-blue-950/50"
                    >
                        <Settings className="h-4 w-4 text-text-secondary" />
                        Settings
                    </Link>

                    <button
                        type="button"
                        onClick={() => setLanguageOpen((current) => !current)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-blue-100/70 dark:hover:bg-blue-950/50"
                    >
                        <Languages className="h-4 w-4 text-text-secondary" />
                        <span className="flex-1 text-left">Language</span>
                        <span className="text-xs uppercase tracking-[0.16em] text-text-secondary">{language}</span>
                    </button>

                    {languageOpen && (
                        <div className="mx-2 mt-1 rounded-xl border border-blue-200/40 bg-blue-50/60 p-1 dark:border-blue-800/30 dark:bg-blue-950/30">
                            {languageOptions.map((option) => (
                                <button
                                    key={option.code}
                                    type="button"
                                    onClick={() => updateLanguage(option.code)}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/70 dark:hover:bg-blue-950/55"
                                >
                                    <span>{option.label}</span>
                                    {language === option.code ? <Check className="h-4 w-4 text-primary" /> : null}
                                </button>
                            ))}
                        </div>
                    )}

                    <Link
                        href="/help"
                        onClick={() => setOpen(false)}
                        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-blue-100/70 dark:hover:bg-blue-950/50"
                    >
                        <LifeBuoy className="h-4 w-4 text-text-secondary" />
                        Get help
                    </Link>

                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50/80 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}

