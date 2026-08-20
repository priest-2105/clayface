"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { designSystemSourceTypes, type DesignSystemSourceType } from "@/lib/design-systems";
import { readDesignSystemErrorMessage } from "@/lib/design-system-errors";

type DesignSystemReference = {
    id: string;
    name: string;
    description: string | null;
    sourceType: "FIGMA" | "LINK" | "UPLOAD" | "OTHER";
    sourceUrl: string | null;
    figmaFileKey: string | null;
    figmaNodeId: string | null;
    notes: string | null;
    isPrimary: boolean;
    createdAt: string;
    updatedAt: string;
};

type DesignSystemsManagerProps = {
    initialReferences: DesignSystemReference[];
};

const sourceTypeLabelMap = {
    FIGMA: "Figma file",
    LINK: "Reference link",
    UPLOAD: "Uploaded asset",
    OTHER: "Other reference",
} as const;

export function DesignSystemsManager({ initialReferences }: DesignSystemsManagerProps) {
    const [references, setReferences] = useState(initialReferences);
    const [submitting, setSubmitting] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        sourceType: "figma" as DesignSystemSourceType,
        sourceUrl: "",
        figmaFileKey: "",
        figmaNodeId: "",
        notes: "",
        isPrimary: references.length === 0,
    });

    const primaryReference = useMemo(() => references.find((reference) => reference.isPrimary) ?? null, [references]);

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            sourceType: "figma",
            sourceUrl: "",
            figmaFileKey: "",
            figmaNodeId: "",
            notes: "",
            isPrimary: references.length === 0,
        });
    };

    const patchReference = (id: string, updater: (reference: DesignSystemReference) => DesignSystemReference) => {
        setReferences((current) => current.map((reference) => (reference.id === id ? updater(reference) : reference)));
    };

    async function createReference(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const response = await fetch("/api/design-systems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(readDesignSystemErrorMessage(data, "Failed to create design system reference."));
            setSubmitting(false);
            return;
        }

        const created = data.reference as DesignSystemReference | undefined;

        if (created) {
            setReferences((current) => {
                const next = created.isPrimary
                    ? current.map((reference) => ({ ...reference, isPrimary: false }))
                    : current.slice();

                return [created, ...next].sort((a, b) => {
                    if (a.isPrimary !== b.isPrimary) {
                        return a.isPrimary ? -1 : 1;
                    }

                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
            });
            setSuccess("Design system reference added.");
            resetForm();
        }

        setSubmitting(false);
    }

    async function makePrimary(reference: DesignSystemReference) {
        setBusyId(reference.id);
        setError(null);
        setSuccess(null);

        const response = await fetch(`/api/design-systems/${reference.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isPrimary: true }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(readDesignSystemErrorMessage(data, "Failed to update design system reference."));
            setBusyId(null);
            return;
        }

        setReferences((current) =>
            current.map((item) => ({
                ...item,
                isPrimary: item.id === reference.id,
            }))
        );
        setSuccess("Primary reference updated.");
        setBusyId(null);
    }

    async function deleteReference(reference: DesignSystemReference) {
        const confirmed = window.confirm(`Delete "${reference.name}"?`);

        if (!confirmed) {
            return;
        }

        setBusyId(reference.id);
        setError(null);
        setSuccess(null);

        const response = await fetch(`/api/design-systems/${reference.id}`, {
            method: "DELETE",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(readDesignSystemErrorMessage(data, "Failed to delete design system reference."));
            setBusyId(null);
            return;
        }

        setReferences((current) => current.filter((item) => item.id !== reference.id));
        setSuccess("Design system reference deleted.");
        setBusyId(null);
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
            <Card className="border border-blue-200/40 bg-white/55 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Design systems</CardTitle>
                    <CardDescription>
                        Store the references Clayface should use when it generates interfaces, pages, and design pieces.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form className="grid gap-4" onSubmit={createReference}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium" htmlFor="designSystemName">
                                    Reference name
                                </label>
                                <Input
                                    id="designSystemName"
                                    value={form.name}
                                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                    placeholder="Acme design system"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium" htmlFor="designSystemDescription">
                                    Description
                                </label>
                                <Textarea
                                    id="designSystemDescription"
                                    value={form.description}
                                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                                    placeholder="Brand style, component rules, spacing rhythm, and visual tone."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="designSystemSourceType">
                                    Source type
                                </label>
                                <select
                                    id="designSystemSourceType"
                                    value={form.sourceType}
                                    onChange={(event) =>
                                        setForm((current) => ({ ...current, sourceType: event.target.value as DesignSystemSourceType }))
                                    }
                                    className={cn(
                                        "h-10 w-full rounded-lg px-3 py-2 text-sm",
                                        "bg-white/50 dark:bg-blue-950/30",
                                        "border border-blue-200/50 dark:border-blue-800/40",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/60"
                                    )}
                                >
                                    {designSystemSourceTypes.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="designSystemSourceUrl">
                                    Reference URL
                                </label>
                                <Input
                                    id="designSystemSourceUrl"
                                    value={form.sourceUrl}
                                    onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))}
                                    placeholder="https://www.figma.com/design/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="designSystemFigmaKey">
                                    Figma file key
                                </label>
                                <Input
                                    id="designSystemFigmaKey"
                                    value={form.figmaFileKey}
                                    onChange={(event) => setForm((current) => ({ ...current, figmaFileKey: event.target.value }))}
                                    placeholder="AbCdEf123"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="designSystemFigmaNode">
                                    Figma node ID
                                </label>
                                <Input
                                    id="designSystemFigmaNode"
                                    value={form.figmaNodeId}
                                    onChange={(event) => setForm((current) => ({ ...current, figmaNodeId: event.target.value }))}
                                    placeholder="12-34"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium" htmlFor="designSystemNotes">
                                    Notes
                                </label>
                                <Textarea
                                    id="designSystemNotes"
                                    value={form.notes}
                                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                                    placeholder="Spacing scale, typography rules, layout constraints, and visual references."
                                />
                            </div>

                            <label className="flex items-center gap-3 rounded-2xl border border-blue-200/40 px-4 py-3 text-sm dark:border-blue-800/30 md:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={form.isPrimary}
                                    onChange={(event) =>
                                        setForm((current) => ({ ...current, isPrimary: event.target.checked }))
                                    }
                                    className="h-4 w-4 rounded border-blue-300 text-primary focus:ring-primary"
                                />
                                Set as the primary reference for new Clayface generations
                            </label>
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

                        <Button type="submit" className="w-full md:w-auto" loading={submitting}>
                            Add design system reference
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border border-blue-200/40 bg-white/55 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Reference library</CardTitle>
                    <CardDescription>
                        Clayface uses these references when interpreting a design brief or Figma source.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {primaryReference ? (
                        <div className="rounded-2xl border border-blue-200/40 bg-blue-50/60 p-4 dark:border-blue-800/30 dark:bg-blue-950/25">
                            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Primary</p>
                            <p className="mt-1 font-semibold">{primaryReference.name}</p>
                            <p className="mt-1 text-sm text-text-secondary">
                                {primaryReference.description || "Primary reference in use."}
                            </p>
                        </div>
                    ) : null}

                    <div className="grid gap-3">
                        {references.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-blue-200/50 p-5 text-sm text-text-secondary dark:border-blue-800/30">
                                Add a design system reference to give Clayface a visual source of truth.
                            </div>
                        ) : (
                            references.map((reference) => (
                                <div
                                    key={reference.id}
                                    className="rounded-2xl border border-blue-200/40 p-4 dark:border-blue-800/30"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{reference.name}</p>
                                                {reference.isPrimary ? (
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                                                        Primary
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="mt-1 text-sm text-text-secondary">
                                                {reference.description || "No description yet."}
                                            </p>
                                            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-secondary">
                                                {sourceTypeLabelMap[reference.sourceType]}
                                            </p>
                                            {reference.sourceUrl ? (
                                                <p className="mt-1 break-all text-xs text-text-secondary">{reference.sourceUrl}</p>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {!reference.isPrimary ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    loading={busyId === reference.id}
                                                    onClick={() => makePrimary(reference)}
                                                >
                                                    Make primary
                                                </Button>
                                            ) : null}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                loading={busyId === reference.id}
                                                onClick={() => deleteReference(reference)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
