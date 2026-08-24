"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function ProjectChatCreateForm({ projectId }: { projectId: string }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${projectId}/chats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, summary }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(typeof data?.error === "string" ? data.error : "Failed to create chat.");
                return;
            }

            setTitle("");
            setSummary("");
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-border bg-background/55 p-4">
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor={`chat-title-${projectId}`}>
                    Chat title
                </label>
                <Input
                    id={`chat-title-${projectId}`}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Homepage audit"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor={`chat-summary-${projectId}`}>
                    Summary
                </label>
                <Textarea
                    id={`chat-summary-${projectId}`}
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    placeholder="What should this chat focus on?"
                />
            </div>

            {error && <p className="text-sm text-[var(--status-error)]">{error}</p>}

            <Button type="submit" variant="primary" className="w-full justify-center gap-2" disabled={loading}>
                <MessageSquarePlus className="h-4 w-4" />
                {loading ? "Creating..." : "Create chat"}
            </Button>
        </form>
    );
}

