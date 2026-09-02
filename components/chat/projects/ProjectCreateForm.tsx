"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function ProjectCreateForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(typeof data?.error === "string" ? data.error : "Failed to create project.");
                return;
            }

            setName("");
            setDescription("");

            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
                <label className="text-label-sm text-foreground" htmlFor="project-name">
                    Name
                </label>
                <Input
                    id="project-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Marketing site"
                    required
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-label-sm text-foreground" htmlFor="project-description">
                    Brief
                </label>
                <Textarea
                    id="project-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What should Clayface generate here?"
                    rows={3}
                />
            </div>

            {error && <p className="text-caption text-[var(--status-error)]">{error}</p>}

            <Button type="submit" variant="primary" className="w-full justify-between gap-2" disabled={loading}>
                <span className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {loading ? "Creating..." : "Create"}
                </span>
                <ArrowRight className="h-4 w-4" />
            </Button>
        </form>
    );
}
