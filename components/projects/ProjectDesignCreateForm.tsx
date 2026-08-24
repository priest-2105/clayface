"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shapes } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { projectDesignStatuses, projectDesignTypes } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function ProjectDesignCreateForm({ projectId }: { projectId: string }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [designType, setDesignType] = useState<(typeof projectDesignTypes)[number]>("page");
    const [status, setStatus] = useState<(typeof projectDesignStatuses)[number]>("draft");
    const [sourceFigmaFileKey, setSourceFigmaFileKey] = useState("");
    const [sourceFigmaNodeId, setSourceFigmaNodeId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${projectId}/designs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    designType,
                    status,
                    sourceFigmaFileKey,
                    sourceFigmaNodeId,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(typeof data?.error === "string" ? data.error : "Failed to create design.");
                return;
            }

            setTitle("");
            setDescription("");
            setSourceFigmaFileKey("");
            setSourceFigmaNodeId("");
            setDesignType("page");
            setStatus("draft");
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-border bg-background/55 p-4">
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor={`design-title-${projectId}`}>
                    Design title
                </label>
                <Input
                    id={`design-title-${projectId}`}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Pricing table redesign"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor={`design-description-${projectId}`}>
                    Description
                </label>
                <Textarea
                    id={`design-description-${projectId}`}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What does this design represent?"
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                    label="Type"
                    value={designType}
                    onChange={setDesignType}
                    options={projectDesignTypes}
                    idPrefix={`design-type-${projectId}`}
                />
                <SelectField
                    label="Status"
                    value={status}
                    onChange={setStatus}
                    options={projectDesignStatuses}
                    idPrefix={`design-status-${projectId}`}
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor={`design-figma-file-${projectId}`}>
                        Figma file key
                    </label>
                    <Input
                        id={`design-figma-file-${projectId}`}
                        value={sourceFigmaFileKey}
                        onChange={(event) => setSourceFigmaFileKey(event.target.value)}
                        placeholder="AbCdEf123"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor={`design-figma-node-${projectId}`}>
                        Figma node id
                    </label>
                    <Input
                        id={`design-figma-node-${projectId}`}
                        value={sourceFigmaNodeId}
                        onChange={(event) => setSourceFigmaNodeId(event.target.value)}
                        placeholder="12:34"
                    />
                </div>
            </div>

            {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}

            <Button type="submit" variant="primary" className="w-full justify-center gap-2" disabled={loading}>
                <Shapes className="h-4 w-4" />
                {loading ? "Creating..." : "Create design"}
            </Button>
        </form>
    );
}

function SelectField<T extends string>({
    label,
    value,
    onChange,
    options,
    idPrefix,
}: {
    label: string;
    value: T;
    onChange: (value: T) => void;
    options: readonly T[];
    idPrefix: string;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={idPrefix}>
                {label}
            </label>
            <select
                id={idPrefix}
                value={value}
                onChange={(event) => onChange(event.target.value as T)}
                className={cn(
                    "h-10 w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/60"
                )}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

