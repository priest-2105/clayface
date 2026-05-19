"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

const themeIcons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
};

const themeOrder = ["system", "light", "dark"] as const;

export function LandingNav() {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        const idx = themeOrder.indexOf(theme);
        setTheme(themeOrder[(idx + 1) % themeOrder.length]);
    };

    return (
        <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-12
            bg-white/50 dark:bg-[rgba(2,11,30,0.6)]
            backdrop-blur-xl
            border-b border-blue-200/30 dark:border-blue-900/25">

            <Link href="/" className="flex items-center gap-2.5">
                <Image src="/logo.svg" alt="Shiva" width={28} height={28} />
                <span className="font-display font-semibold text-lg tracking-tight text-foreground">Shiva</span>
            </Link>

            <div className="flex items-center gap-2">
                <button
                    onClick={cycleTheme}
                    title={`Theme: ${theme}`}
                    className="flex items-center justify-center h-8 w-8 rounded-full text-text-secondary
                        hover:bg-blue-100/60 dark:hover:bg-blue-950/50
                        hover:text-foreground transition-colors"
                >
                    {themeIcons[theme]}
                </button>

                <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-sm">
                        Sign in
                    </Button>
                </Link>

                <Link href="/chat">
                    <Button variant="primary" size="sm" className="text-sm">
                        Start building
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
