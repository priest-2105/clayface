"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ChatThread } from "@/components/chat/workspace/ChatThread";
import { CodePanel } from "@/components/chat/workspace/CodePanel";

export type UserMessage = {
    id: number;
    type: "user";
    content: string;
    framework: string;
    design: string;
    time: string;
};

export type GenerationMessage = {
    id: number;
    type: "generation";
    generationId: number;
    componentName: string;
    files: string[];
    description: string;
    time: string;
};

export type Message = UserMessage | GenerationMessage;

type ProjectChatMessageResponse = {
    id: string;
    role: "USER" | "ASSISTANT" | "SYSTEM";
    content: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
};

type ProjectChatResponse = {
    id: string;
    title: string;
    summary: string | null;
    status: string;
    project: {
        id: string;
        name: string;
        slug: string;
    };
    messages: ProjectChatMessageResponse[];
};

export default function WorkspacePage() {
    const params = useParams<{ id: string }>();
    const chatId = params?.id;
    const [threadOpen, setThreadOpen] = useState(true);
    const [activeGenId, setActiveGenId] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chatTitle, setChatTitle] = useState("Loading chat...");

    useEffect(() => {
        if (!chatId) {
            return;
        }

        let cancelled = false;

        async function loadChat() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/project-chats/${chatId}`, {
                    cache: "no-store",
                });

                const data = (await response.json()) as { chat?: ProjectChatResponse; error?: string };

                if (!response.ok || !data.chat) {
                    throw new Error(data.error || "Failed to load chat.");
                }

                if (cancelled) {
                    return;
                }

                setChatTitle(data.chat.title);
                const nextMessages = mapChatMessages(data.chat.messages);
                setMessages(nextMessages);

                const lastGeneration = [...nextMessages].reverse().find((message) => message.type === "generation");
                setActiveGenId(lastGeneration?.type === "generation" ? lastGeneration.generationId : 0);
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Failed to load chat.");
                    setMessages([]);
                    setChatTitle("Chat unavailable");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadChat();

        return () => {
            cancelled = true;
        };
    }, [chatId]);

    const headerLabel = useMemo(() => {
        if (loading) {
            return "Loading chat";
        }

        return chatTitle;
    }, [chatTitle, loading]);

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 overflow-hidden">
                <ChatThread
                    messages={messages}
                    open={threadOpen}
                    activeGenId={activeGenId}
                    onToggle={() => setThreadOpen(!threadOpen)}
                    onSelectGeneration={setActiveGenId}
                />
                <CodePanel
                    activeGenId={activeGenId}
                    threadOpen={threadOpen}
                    onOpenThread={() => setThreadOpen(true)}
                />
            </div>

            {loading && (
                <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-card-bg/90 px-4 py-2 text-xs text-text-secondary shadow-lg shadow-black/20 backdrop-blur-xl">
                    Loading {headerLabel.toLowerCase()}...
                </div>
            )}

            {error && (
                <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-red-500/30 bg-red-950/80 px-4 py-2 text-xs text-red-200 shadow-lg shadow-black/20 backdrop-blur-xl">
                    {error}
                </div>
            )}
        </div>
    );
}

function mapChatMessages(messages: ProjectChatMessageResponse[]): Message[] {
    let generationId = 0;

    const nextMessages: Message[] = [];

    for (const [index, message] of messages.entries()) {
        const time = new Date(message.createdAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });

        if (message.role === "USER") {
            nextMessages.push({
                id: index + 1,
                type: "user",
                content: message.content,
                framework: (message.metadata?.framework as string) || "Next.js",
                design: (message.metadata?.design as string) || "Reference-driven",
                time,
            });
            continue;
        }

        if (message.role === "ASSISTANT") {
            generationId += 1;
            nextMessages.push({
                id: index + 1,
                type: "generation",
                generationId,
                componentName: (message.metadata?.componentName as string) || "Generated result",
                files: Array.isArray(message.metadata?.files) ? (message.metadata?.files as string[]) : [],
                description: (message.metadata?.description as string) || message.content,
                time,
            });
            continue;
        }

        nextMessages.push({
            id: index + 1,
            type: "generation",
            generationId: ++generationId,
            componentName: "System note",
            files: [],
            description: message.content,
            time,
        });
    }

    return nextMessages;
}
