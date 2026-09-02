"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField, FormSection, FormLabel } from "@/components/ui/Form";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog, DesignSystemReferenceCard } from "@/components/clayface";
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
            <Card className="border border-border bg-card-bg ">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Design systems</CardTitle>
                    <CardDescription>
                        Store the references Clayface should use when it generates interfaces, pages, and design pieces.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form className="grid gap-4" onSubmit={createReference}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField className="md:col-span-2">
                                <FormLabel htmlFor="designSystemName">
                                    Reference name
                                </FormLabel>
                                <Input
                                    id="designSystemName"
                                    value={form.name}
                                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                    placeholder="Acme design system"
                                    required
                                />
                            </FormField>

                            <FormField className="md:col-span-2">
                                <FormLabel htmlFor="designSystemDescription">
                                    Description
                                </FormLabel>
                                <Textarea
                                    id="designSystemDescription"
                                    value={form.description}
                                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                                    placeholder="Brand style, component rules, spacing rhythm, and visual tone."
                                />
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="designSystemSourceType">
                                    Source type
                                </FormLabel>
                                <Select
                                    id="designSystemSourceType"
                                    value={form.sourceType}
                                    onChange={(event) =>
                                        setForm((current) => ({ ...current, sourceType: event.target.value as DesignSystemSourceType }))
                                    }
                                >
                                    {designSystemSourceTypes.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="designSystemSourceUrl">
                                    Reference URL
                                </FormLabel>
                                <Input
                                    id="designSystemSourceUrl"
                                    value={form.sourceUrl}
                                    onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))}
                                    placeholder="https://www.figma.com/design/..."
                                />
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="designSystemFigmaKey">
                                    Figma file key
                                </FormLabel>
                                <Input
                                    id="designSystemFigmaKey"
                                    value={form.figmaFileKey}
                                    onChange={(event) => setForm((current) => ({ ...current, figmaFileKey: event.target.value }))}
                                    placeholder="AbCdEf123"
                                />
                            </FormField>

                            <FormField>
                                <FormLabel htmlFor="designSystemFigmaNode">
                                    Figma node ID
                                </FormLabel>
                                <Input
                                    id="designSystemFigmaNode"
                                    value={form.figmaNodeId}
                                    onChange={(event) => setForm((current) => ({ ...current, figmaNodeId: event.target.value }))}
                                    placeholder="12-34"
                                />
                            </FormField>

                            <FormField className="md:col-span-2">
                                <FormLabel htmlFor="designSystemNotes">
                                    Notes
                                </FormLabel>
                                <Textarea
                                    id="designSystemNotes"
                                    value={form.notes}
                                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                                    placeholder="Spacing scale, typography rules, layout constraints, and visual references."
                                />
                            </FormField>

                            <FormSection className="flex items-center gap-3 rounded-[var(--r-1)] px-4 py-3 text-sm md:col-span-2">
                                <Checkbox
                                    type="checkbox"
                                    checked={form.isPrimary}
                                    onChange={(event) =>
                                        setForm((current) => ({ ...current, isPrimary: event.target.checked }))
                                    }
                                />
                                <span>Set as the primary reference for new Clayface generations</span>
                            </FormSection>
                        </div>

                        {error && (
                            <Alert variant="error">
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert variant="success">
                                {success}
                            </Alert>
                        )}

                        <Button type="submit" className="w-full md:w-auto" loading={submitting}>
                            Add design system reference
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border border-border bg-card-bg ">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Reference library</CardTitle>
                    <CardDescription>
                        Clayface uses these references when interpreting a design brief or Figma source.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {primaryReference ? (
                        <div className="rounded-[var(--r-2)] border border-border bg-primary/10 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Primary</p>
                            <p className="mt-1 font-semibold">{primaryReference.name}</p>
                            <p className="mt-1 text-sm text-text-secondary">
                                {primaryReference.description || "Primary reference in use."}
                            </p>
                        </div>
                    ) : null}

                    <div className="grid gap-3">
                        {references.length === 0 ? (
                            <div className="rounded-[var(--r-2)] border border-dashed border-border p-5 text-sm text-text-secondary">
                                Add a design system reference to give Clayface a visual source of truth.
                            </div>
                        ) : (
                            references.map((reference) => (
                                <DesignSystemReferenceCard
                                    key={reference.id}
                                    name={reference.name}
                                    description={reference.description}
                                    sourceType={reference.sourceType}
                                    sourceUrl={reference.sourceUrl}
                                    isPrimary={reference.isPrimary}
                                    actions={
                                        <>
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
                                            <ConfirmDialog
                                                trigger={
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        loading={busyId === reference.id}
                                                    >
                                                        Delete
                                                    </Button>
                                                }
                                                title={`Delete ${reference.name}?`}
                                                description="This removes the reference from Clayface. Projects using it will no longer have this source available."
                                                confirmLabel="Delete reference"
                                                destructive
                                                onConfirm={() => deleteReference(reference)}
                                            />
                                        </>
                                    }
                                />
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
