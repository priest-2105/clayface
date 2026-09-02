"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChatMessage, ChatMetaBadge, GenerationPreview, PromptBox, StatusPill } from "@/components/clayface";
import { cn } from "@/lib/utils";
import type { Message } from "@/app/chat/[id]/page";

interface ChatThreadProps {
    messages: Message[];
    open: boolean;
    activeGenId: number;
    onToggle: () => void;
    onSelectGeneration: (id: number) => void;
}

export function ChatThread({ messages, open, activeGenId, onToggle, onSelectGeneration }: ChatThreadProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");

    const stats = useMemo(() => {
        const generations = messages.filter((message): message is Extract<Message, { type: "generation" }> => message.type === "generation").length;
        return {
            messages: messages.length,
            generations,
        };
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div
            className={cn(
                "flex shrink-0 flex-col overflow-hidden border-r border-border transition-all duration-300 ease-in-out h-full",
                "bg-card-bg",
                open ? "w-[400px]" : "w-0 border-r-0"
            )}
        >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-caps text-text-secondary">Thread</span>
                        <StatusPill value={`${stats.messages} messages`} className="h-5 text-[10px]" />
                    </div>
                    <p className="text-caption">Prompt history, generation trail, and editable context</p>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="h-8 w-8 p-0 text-text-secondary"
                    aria-label="Collapse thread"
                >
                    <PanelLeftClose className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 min-w-[400px]">
                <div className="flex flex-wrap gap-2">
                    <StatusPill label="Generations" value={stats.generations} />
                    <StatusPill label="Style" value="Reference-first" />
                    <StatusPill label="Mode" value="Canvas synced" />
                </div>

                {messages.length === 0 ? (
                    <EmptyState
                        className="min-h-48 bg-background"
                        title="This chat is empty"
                        description="Create a prompt or seed the project with an initial reference-led brief."
                    />
                ) : (
                    messages.map((msg) =>
                        msg.type === "user" ? (
                            <ChatMessage
                                key={msg.id}
                                role="user"
                                content={msg.content}
                                time={msg.time}
                                meta={
                                    <>
                                        <ChatMetaBadge>{msg.framework}</ChatMetaBadge>
                                        <ChatMetaBadge>{msg.design}</ChatMetaBadge>
                                    </>
                                }
                            />
                        ) : (
                            <GenerationPreview
                                key={msg.id}
                                componentName={msg.componentName}
                                description={msg.description}
                                files={msg.files}
                                time={msg.time}
                                active={msg.generationId === activeGenId}
                                onClick={() => onSelectGeneration(msg.generationId)}
                            />
                        )
                    )
                )}
                <div ref={bottomRef} />
            </div>

            <div className="shrink-0 border-t border-border p-3">
                <PromptBox
                    className="max-w-none"
                    value={input}
                    onValueChange={setInput}
                    placeholder="Refine the current reference or ask for a new variant..."
                    onSubmitPrompt={() => setInput("")}
                />
            </div>
        </div>
    );
}
