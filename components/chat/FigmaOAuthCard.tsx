"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Frame, Link2, RefreshCcw, Unplug } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type FigmaStatus = {
    configured: boolean;
    connected: boolean;
    expiresAt: number | null;
    scope: string | null;
    userId: string | null;
};

type SelectionResult = {
    file: {
        key: string;
        name: string | null;
        lastModified: string | null;
        version: string | null;
    };
    selection: {
        nodeId: string;
        name: string | null;
        type: string | null;
        layoutMode: string | null;
        childrenCount: number;
        componentId: string | null;
        absoluteBoundingBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
        absoluteRenderBounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
    };
    raw: unknown;
};

const statusMessageMap: Record<string, string> = {
    connected: "Figma connected. You can now fetch selected frame metadata.",
    denied: "Figma authorization was denied.",
    "missing-config": "Figma OAuth env vars are missing.",
    "state-mismatch": "Figma OAuth state validation failed. Try connecting again.",
    "exchange-failed": "Figma code exchange failed. Re-run the OAuth flow.",
};

export function FigmaOAuthCard() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<FigmaStatus | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [selection, setSelection] = useState("");
    const [result, setResult] = useState<SelectionResult | null>(null);
    const [loadingSelection, setLoadingSelection] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const figmaStatusKey = searchParams.get("figma");
    const flashMessage = figmaStatusKey ? statusMessageMap[figmaStatusKey] : null;

    const connectHref = useMemo(() => {
        const params = new URLSearchParams({ returnTo: pathname || "/chat" });
        return `/api/figma/oauth/start?${params.toString()}`;
    }, [pathname]);

    useEffect(() => {
        let cancelled = false;

        async function loadStatus() {
            try {
                setLoadingStatus(true);
                const response = await fetch("/api/figma/status", { cache: "no-store" });
                const data = (await response.json()) as FigmaStatus;

                if (!cancelled) {
                    setStatus(data);
                }
            } finally {
                if (!cancelled) {
                    setLoadingStatus(false);
                }
            }
        }

        loadStatus();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!figmaStatusKey) {
            return;
        }

        const next = new URLSearchParams(searchParams.toString());
        next.delete("figma");
        const nextQuery = next.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }, [figmaStatusKey, pathname, router, searchParams]);

    async function refreshStatus() {
        setLoadingStatus(true);
        const response = await fetch("/api/figma/status", { cache: "no-store" });
        const data = (await response.json()) as FigmaStatus;
        setStatus(data);
        setLoadingStatus(false);
    }

    async function disconnect() {
        await fetch("/api/figma/disconnect", { method: "POST" });
        setResult(null);
        setError(null);
        await refreshStatus();
    }

    async function inspectSelection() {
        try {
            setLoadingSelection(true);
            setError(null);

            const response = await fetch("/api/figma/selection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    selection,
                    depth: 2,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(typeof data?.error === "string" ? data.error : "Failed to fetch Figma metadata.");
            }

            setResult(data as SelectionResult);
        } catch (fetchError) {
            setResult(null);
            setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch Figma metadata.");
        } finally {
            setLoadingSelection(false);
        }
    }

    return (
        <section className="rounded-[var(--r-2)] border border-border bg-background">
            <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                    <Frame className="h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                        <p className="text-label-sm text-foreground">Figma</p>
                        <p className="truncate text-caption text-text-tertiary">
                            {loadingStatus
                                ? "Checking..."
                                : !status?.configured
                                    ? "Setup needed"
                                    : status.connected
                                        ? "Connected"
                                        : "Not connected"}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--r-1)] text-text-tertiary transition-colors hover:bg-[var(--surface-tint)] hover:text-foreground"
                    aria-label={expanded ? "Collapse Figma panel" : "Expand Figma panel"}
                >
                    <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
                </button>
            </div>

            {expanded && (
                <div className="space-y-3 p-3">
                    {flashMessage && (
                        <div className="rounded-[var(--r-1)] border border-border bg-primary/10 px-3 py-2 text-caption text-foreground">
                            {flashMessage}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm" onClick={refreshStatus} disabled={loadingStatus}>
                            <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                            Refresh
                        </Button>
                        {status?.connected ? (
                            <Button variant="outline" size="sm" onClick={disconnect}>
                                <Unplug className="mr-1.5 h-3.5 w-3.5" />
                                Disconnect
                            </Button>
                        ) : (
                            <Button variant="primary" size="sm" onClick={() => window.location.assign(connectHref)}>
                                <Link2 className="mr-1.5 h-3.5 w-3.5" />
                                Connect
                            </Button>
                        )}
                    </div>

                    {!status?.configured && !loadingStatus && (
                        <p className="text-caption leading-5 text-[var(--status-warning)]">
                            Add Figma OAuth environment variables to enable imports.
                        </p>
                    )}

                    <div className="space-y-2">
                        <label className="block text-label-sm text-foreground">Frame URL</label>
                        <Input
                            value={selection}
                            onChange={(event) => setSelection(event.target.value)}
                            placeholder="Paste Figma frame URL"
                        />
                        <Button
                            size="sm"
                            className="w-full"
                            onClick={inspectSelection}
                            disabled={!status?.connected || loadingSelection || !selection.trim()}
                        >
                            {loadingSelection ? "Fetching..." : "Inspect frame"}
                        </Button>
                    </div>

                    {error && (
                        <div className="rounded-[var(--r-1)] border border-[var(--status-error)]/30 bg-[var(--status-error)]/10 px-3 py-2 text-caption text-[var(--status-error)]">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="rounded-[var(--r-1)] border border-border bg-card-bg p-3">
                            <div className="space-y-1.5">
                                <MetadataRow label="File" value={result.file.name || result.file.key} />
                                <MetadataRow label="Node" value={result.selection.name || result.selection.nodeId} />
                                <MetadataRow label="Type" value={result.selection.type || "Unknown"} />
                                <MetadataRow label="Bounds" value={formatBounds(result.selection.absoluteBoundingBox)} mono />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

function MetadataRow({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-b-0">
            <span className="text-text-secondary">{label}</span>
            <span className={mono ? "font-mono text-right text-xs text-foreground" : "text-right text-foreground"}>
                {value}
            </span>
        </div>
    );
}

function formatBounds(
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null
) {
    if (!bounds) {
        return "Unavailable";
    }

    return `${Math.round(bounds.width)}x${Math.round(bounds.height)} @ ${Math.round(bounds.x)},${Math.round(bounds.y)}`;
}
