"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { dashboardThemes, type DashboardThemeValue } from "@/lib/dashboard-theme";
import { readAuthErrorMessage } from "@/lib/auth-errors";

type DashboardThemeSelectorProps = {
    initialTheme: DashboardThemeValue;
};

export function DashboardThemeSelector({ initialTheme }: DashboardThemeSelectorProps) {
    const router = useRouter();
    const [selectedTheme, setSelectedTheme] = useState<DashboardThemeValue>(initialTheme);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function saveTheme() {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const response = await fetch("/api/settings/dashboard-theme", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ theme: selectedTheme }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(readAuthErrorMessage(data, "Failed to update dashboard theme."));
            setLoading(false);
            return;
        }

        setLoading(false);
        setSuccess("Dashboard theme updated.");
        router.refresh();
    }

    return (
        <Card className="border border-blue-200/40 bg-card-bg/80 dark:border-blue-800/30">
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight">Appearance</CardTitle>
                <CardDescription>
                    Choose the dashboard palette. This does not change the public site, which stays dark by default.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {dashboardThemes.map((option) => {
                        const active = selectedTheme === option.value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setSelectedTheme(option.value)}
                                disabled={loading}
                                className={cn(
                                    "rounded-2xl border p-4 text-left transition-all",
                                    active
                                        ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                                        : "border-blue-200/40 bg-white/50 hover:bg-blue-50/70 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.35)] dark:hover:bg-blue-950/35"
                                )}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold">{option.label}</p>
                                        <p className="mt-1 text-sm text-text-secondary">{option.description}</p>
                                    </div>
                                    <span
                                        className={cn(
                                            "h-10 w-10 rounded-full border",
                                            option.value === "blue" && "bg-[#569cd6] border-[#6cb6ff]/40",
                                            option.value === "light" && "bg-[#f3f3f3] border-[#d4d4d4]",
                                            option.value === "gray" && "bg-[#ffffff] border-[#e2e8f0]",
                                            option.value === "rose" && "bg-[#000000] border-[#ffffff]/60",
                                            option.value === "emerald" && "bg-[#1f232a] border-[#464c56]/80"
                                        )}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <p className="rounded-lg border border-red-300/40 bg-red-50/60 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="rounded-lg border border-blue-300/40 bg-blue-50/60 px-3 py-2 text-sm text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-100">
                        {success}
                    </p>
                )}

                <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" loading={loading} onClick={saveTheme}>
                        {loading ? "Updating..." : "Save appearance"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
