"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { PanelLeftClose, ArrowUp, Paperclip, FileCode, Cpu } from "lucide-react";
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
                "bg-card-bg/78 backdrop-blur-xl",
                open ? "w-[400px]" : "w-0 border-r-0"
            )}
        >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                            Thread
                        </span>
                        <span className="rounded-full border border-border bg-background/65 px-2 py-0.5 text-[10px] text-text-secondary">
                            {stats.messages} messages
                        </span>
                    </div>
                    <p className="text-xs text-text-secondary">Prompt history, generation trail, and editable context</p>
                </div>
                <button
                    onClick={onToggle}
                    className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-primary/10 hover:text-foreground"
                    aria-label="Collapse thread"
                >
                    <PanelLeftClose className="h-4 w-4" />
                </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 min-w-[400px]">
                <div className="flex flex-wrap gap-2">
                    <StatusPill label="Generations" value={String(stats.generations)} />
                    <StatusPill label="Style" value="Reference-first" />
                    <StatusPill label="Mode" value="Canvas synced" />
                </div>

                {messages.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-background/45 p-5">
                        <p className="text-sm font-medium text-foreground">This chat is empty.</p>
                        <p className="mt-1 text-sm text-text-secondary">
                            Create a prompt or seed the project with an initial reference-led brief.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) =>
                        msg.type === "user" ? (
                            <UserBubble key={msg.id} message={msg} />
                        ) : (
                            <GenerationCard
                                key={msg.id}
                                message={msg}
                                isActive={msg.generationId === activeGenId}
                                onSelect={() => onSelectGeneration(msg.generationId)}
                            />
                        )
                    )
                )}
                <div ref={bottomRef} />
            </div>

            <div className="shrink-0 border-t border-border p-3">
                <div
                    className={cn(
                        "flex items-end gap-2 rounded-2xl border border-border px-3 py-2.5",
                        "bg-background/65 backdrop-blur-sm transition-colors",
                        "focus-within:border-primary/60"
                    )}
                >
                    <button className="mb-0.5 shrink-0 p-1 text-text-secondary transition-colors hover:text-foreground">
                        <Paperclip className="h-4 w-4" />
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Refine the current reference or ask for a new variant..."
                        rows={1}
                        className="max-h-32 flex-1 resize-none bg-transparent py-1 text-sm text-foreground outline-none placeholder:text-text-secondary/50"
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = "auto";
                            el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
                        }}
                    />
                    <button
                        className={cn(
                            "mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                            input.trim()
                                ? "bg-primary text-white shadow-sm shadow-blue-500/20"
                                : "cursor-not-allowed bg-primary/10 text-text-secondary"
                        )}
                        disabled={!input.trim()}
                    >
                        <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusPill({ label, value }: { label: string; value: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 px-3 py-1 text-xs text-text-secondary">
            <span className="uppercase tracking-[0.18em]">{label}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="font-medium text-foreground">{value}</span>
        </div>
    );
}

function UserBubble({ message }: { message: Extract<Message, { type: "user" }> }) {
    return (
        <div className="flex flex-col items-end gap-1.5">
            <div className="inline-flex items-center gap-2 px-1 text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                <span>You</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{message.time}</span>
            </div>
            <div
                className={cn(
                    "max-w-[88%] rounded-2xl rounded-tr-sm border px-4 py-3 text-sm leading-relaxed",
                    "border-primary/20 bg-primary/12 text-foreground shadow-sm shadow-primary/5"
                )}
            >
                {message.content}
            </div>
            <div className="flex items-center gap-1.5 px-1">
                <span className="rounded-full border border-border bg-background/65 px-2 py-0.5 font-mono text-[10px] text-text-secondary">
                    {message.framework}
                </span>
                <span className="rounded-full border border-border bg-background/65 px-2 py-0.5 font-mono text-[10px] text-text-secondary">
                    {message.design}
                </span>
            </div>
        </div>
    );
}

function GenerationCard({
    message,
    isActive,
    onSelect,
}: {
    message: Extract<Message, { type: "generation" }>;
    isActive: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full rounded-2xl border p-4 text-left transition-all duration-150",
                isActive
                    ? "border-primary/30 bg-primary/10 shadow-sm shadow-primary/10"
                    : "border-border bg-background/55 hover:border-primary/20 hover:bg-primary/5"
            )}
        >
            <div className="flex items-start gap-3">
                <div
                    className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
                        isActive ? "border-primary/30 bg-primary/15" : "border-border bg-primary/8"
                    )}
                >
                    <Cpu className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-text-secondary")} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-sm font-medium text-foreground">{message.componentName}</span>
                        <span className="shrink-0 text-[10px] text-text-secondary/60">{message.time}</span>
                    </div>
                    <p className="mb-2.5 text-xs leading-relaxed text-text-secondary line-clamp-2">
                        {message.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {message.files.map((f) => (
                            <span
                                key={f}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-background/70 px-2 py-0.5 font-mono text-[10px] text-text-secondary"
                            >
                                <FileCode className="h-2.5 w-2.5" />
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            {isActive && (
                <div className="mt-3 flex items-center gap-1.5 border-t border-border/70 pt-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
                        Viewing in canvas
                    </span>
                </div>
            )}
        </button>
    );
}
