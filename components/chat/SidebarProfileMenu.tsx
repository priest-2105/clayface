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
        const stored = localStorage.getItem("clayface-language");
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
        localStorage.setItem("clayface-language", next);
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
                    "bg-card-bg",
                    "hover:border-primary/60",
                    "border border-border"
                )}
            >
                <Avatar className="h-10 w-10">
                    {user.image ? <AvatarImage src={user.image} alt={user.name || user.email || "User avatar"} /> : null}
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{user.name || "Clayface User"}</p>
                    <p className="truncate text-xs text-text-secondary">Profile and preferences</p>
                </div>
                <ChevronUp className={cn("h-4 w-4 text-text-secondary transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <div className="absolute bottom-full mb-2 w-full rounded-2xl border border-border bg-card-bg p-2">
                    <Link
                        href="/settings?tab=account"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-background"
                    >
                        <Settings className="h-4 w-4 text-text-secondary" />
                        Settings
                    </Link>

                    <button
                        type="button"
                        onClick={() => setLanguageOpen((current) => !current)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-background"
                    >
                        <Languages className="h-4 w-4 text-text-secondary" />
                        <span className="flex-1 text-left">Language</span>
                        <span className="text-xs uppercase tracking-[0.16em] text-text-secondary">{language}</span>
                    </button>

                    {languageOpen && (
                        <div className="mx-2 mt-1 rounded-xl border border-border bg-background p-1">
                            {languageOptions.map((option) => (
                                <button
                                    key={option.code}
                                    type="button"
                                    onClick={() => updateLanguage(option.code)}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-card-bg"
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
                        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-background"
                    >
                        <LifeBuoy className="h-4 w-4 text-text-secondary" />
                        Get help
                    </Link>

                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}

