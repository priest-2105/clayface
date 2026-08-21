"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, ExternalLink, Frame, Link2, Unplug, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

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
        <div className="border-b border-border bg-card-bg">
            <div className="mx-auto w-full max-w-[1600px] px-6 py-5">
                <Card className="border border-border bg-card-bg">
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-primary/10">
                                    <Frame className="h-4.5 w-4.5 text-primary" />
                                </span>
                                <div>
                                    <CardTitle className="text-xl">Figma reference inspector</CardTitle>
                                    <CardDescription>
                                        Connect Figma, inspect a frame, and translate the structure into Clayface-ready design references.
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
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
                                    Connect Figma
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {flashMessage && (
                            <div className="rounded-xl border border-border bg-primary/10 px-4 py-3 text-sm text-foreground">
                                {flashMessage}
                            </div>
                        )}

                        <div className="grid gap-3 md:grid-cols-3">
                            <StatusTile
                                label="OAuth"
                                value={
                                    loadingStatus
                                        ? "Checking..."
                                        : !status?.configured
                                            ? "Missing env"
                                            : status.connected
                                                ? "Connected"
                                                : "Not connected"
                                }
                                accent={status?.connected ? "ok" : "neutral"}
                            />
                            <StatusTile
                                label="Scope"
                                value={status?.scope || "file_content:read"}
                            />
                            <StatusTile
                                label="Token expiry"
                                value={status?.expiresAt ? new Date(status.expiresAt).toLocaleString() : "Not available"}
                            />
                        </div>

                        {!status?.configured && !loadingStatus && (
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                                Add `FIGMA_CLIENT_ID`, `FIGMA_CLIENT_SECRET`, and `FIGMA_OAUTH_REDIRECT_URI` to enable the OAuth flow.
                            </div>
                        )}

                        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-foreground">
                                    Selected frame URL or `fileKey,nodeId`
                                </label>
                                <Input
                                    value={selection}
                                    onChange={(event) => setSelection(event.target.value)}
                                    placeholder="https://www.figma.com/design/FILE_KEY/Name?node-id=12-34"
                                />
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        onClick={inspectSelection}
                                        disabled={!status?.connected || loadingSelection || !selection.trim()}
                                    >
                                        {loadingSelection ? "Fetching..." : "Fetch frame metadata"}
                                    </Button>
                                    <a
                                        href="https://developers.figma.com/docs/rest-api/file-endpoints/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        File API reference
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                                {error && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-border bg-background p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                                    <BadgeCheck className="h-4 w-4 text-primary" />
                                    What this expects
                                </div>
                                <ul className="space-y-2 text-sm leading-6 text-text-secondary">
                                    <li>OAuth scope: `file_content:read`</li>
                                    <li>Use a selected Figma frame URL that includes `node-id`</li>
                                    <li>The connected Figma user must have access to that file</li>
                                </ul>
                            </div>
                        </div>

                        {result && (
                            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
                                        Selection Summary
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <MetadataRow label="File" value={result.file.name || result.file.key} />
                                        <MetadataRow label="File key" value={result.file.key} mono />
                                        <MetadataRow label="Node id" value={result.selection.nodeId} mono />
                                        <MetadataRow label="Node name" value={result.selection.name || "Unknown"} />
                                        <MetadataRow label="Type" value={result.selection.type || "Unknown"} />
                                        <MetadataRow label="Layout" value={result.selection.layoutMode || "None"} />
                                        <MetadataRow label="Children" value={String(result.selection.childrenCount)} />
                                        <MetadataRow
                                            label="Bounds"
                                            value={formatBounds(result.selection.absoluteBoundingBox)}
                                            mono
                                        />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-border bg-background p-4">
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
                                        Raw API Payload
                                    </h3>
                                    <pre className="max-h-96 overflow-auto text-xs leading-6 text-foreground font-mono">
                                        {JSON.stringify(result.raw, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatusTile({
    label,
    value,
    accent = "neutral",
}: {
    label: string;
    value: string;
    accent?: "neutral" | "ok";
}) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-secondary">{label}</div>
            <div className={accent === "ok" ? "text-sm font-semibold text-primary" : "text-sm font-semibold text-foreground"}>
                {value}
            </div>
        </div>
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
