export const dashboardThemes = [
    {
        value: "blue",
        label: "Dark+",
        description: "VS Code's default dark workbench.",
        className: "dashboard-theme-dark-plus",
        mode: "dark" as const,
    },
    {
        value: "light",
        label: "Light+",
        description: "The classic VS Code light workbench.",
        className: "dashboard-theme-light-plus",
        mode: "light" as const,
    },
    {
        value: "gray",
        label: "Quiet Light",
        description: "Low-contrast, editorial light styling.",
        className: "dashboard-theme-quiet-light",
        mode: "light" as const,
    },
    {
        value: "rose",
        label: "High Contrast",
        description: "Strong contrast for clarity and accessibility.",
        className: "dashboard-theme-high-contrast",
        mode: "dark" as const,
    },
    {
        value: "emerald",
        label: "Dark Modern",
        description: "A softer, newer dark workbench feel.",
        className: "dashboard-theme-dark-modern",
        mode: "dark" as const,
    },
] as const;

export type DashboardThemeValue = (typeof dashboardThemes)[number]["value"];

export function isDashboardThemeValue(value: string | undefined): value is DashboardThemeValue {
    return Boolean(value) && dashboardThemes.some((theme) => theme.value === value);
}

export function dashboardThemeToDbValue(value: DashboardThemeValue) {
    return value.toUpperCase() as "BLUE" | "LIGHT" | "GRAY" | "ROSE" | "EMERALD";
}

export function dashboardThemeFromDbValue(value: string | null | undefined): DashboardThemeValue {
    const normalized = (value || "BLUE").toLowerCase();

    if (normalized === "blue" || normalized === "light" || normalized === "gray" || normalized === "rose" || normalized === "emerald") {
        return normalized;
    }

    return "blue";
}

export function getDashboardThemeConfig(value: DashboardThemeValue | string | null | undefined) {
    const normalized = dashboardThemeFromDbValue(value);
    return dashboardThemes.find((theme) => theme.value === normalized) ?? dashboardThemes[0];
}
