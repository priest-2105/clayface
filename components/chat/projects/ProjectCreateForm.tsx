"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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
        <form
            onSubmit={handleSubmit}
            className="grid gap-3 lg:grid-cols-[minmax(180px,0.75fr)_minmax(260px,1.35fr)_auto] lg:items-end"
        >
            <div className="space-y-1.5">
                <label className="text-label-sm text-foreground" htmlFor="project-name">
                    Project
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
                    placeholder="What should Clayface generate?"
                    rows={1}
                    className="min-h-10 resize-none rounded-[var(--r-1)] py-2.5"
                />
            </div>

            <Button type="submit" variant="primary" className="w-full justify-between gap-2 lg:w-32" disabled={loading}>
                {loading ? "Creating..." : "Create"}
                <ArrowRight className="h-4 w-4" />
            </Button>

            {error && <p className="text-caption text-[var(--status-error)] lg:col-span-3">{error}</p>}
        </form>
    );
}
