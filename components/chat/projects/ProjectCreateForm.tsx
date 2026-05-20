"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-border bg-background/55 p-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="project-name">
                    Project name
                </label>
                <Input
                    id="project-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Marketing site redesign"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="project-description">
                    Description
                </label>
                <Textarea
                    id="project-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Briefly describe what the project should track."
                />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" variant="primary" className="w-full justify-center gap-2" disabled={loading}>
                <Plus className="h-4 w-4" />
                {loading ? "Creating..." : "Create project"}
            </Button>
        </form>
    );
}
