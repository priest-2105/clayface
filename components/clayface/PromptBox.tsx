"use client";

import * as React from "react";
import NextImage from "next/image";
import { ArrowUp, FileText, Image as ImageIcon, Mic, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

export type PromptAttachment = {
    id: string;
    name: string;
    type?: string;
    previewUrl?: string;
};

export interface PromptBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    attachments?: PromptAttachment[];
    framework?: string;
    designSystem?: string;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
    onSubmitPrompt?: (payload: { value: string; framework: string; designSystem: string }) => void;
    onAttach?: (accept: string) => void;
    onRemoveAttachment?: (id: string) => void;
    onFrameworkChange?: (framework: string) => void;
    onDesignSystemChange?: (designSystem: string) => void;
}

const frameworkOptions = ["Next.js", "React", "HTML/JS"];
const designSystemOptions = ["Shadcn UI", "Salt DS", "Material UI", "CSS Only"];

const PromptBox = React.forwardRef<HTMLDivElement, PromptBoxProps>(
    (
        {
            className,
            value,
            defaultValue = "",
            placeholder = "Describe the component or page you want to build...",
            attachments = [],
            framework = "Next.js",
            designSystem = "Shadcn UI",
            disabled = false,
            onValueChange,
            onSubmitPrompt,
            onAttach,
            onRemoveAttachment,
            onFrameworkChange,
            onDesignSystemChange,
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue);
        const [attachOpen, setAttachOpen] = React.useState(false);
        const textareaRef = React.useRef<HTMLTextAreaElement>(null);
        const isControlled = value !== undefined;
        const promptValue = isControlled ? value : internalValue;
        const canSubmit = promptValue.trim().length > 0 || attachments.length > 0;

        function updateValue(nextValue: string) {
            if (!isControlled) {
                setInternalValue(nextValue);
            }

            onValueChange?.(nextValue);
        }

        function submitPrompt() {
            if (!canSubmit || disabled) {
                return;
            }

            onSubmitPrompt?.({ value: promptValue, framework, designSystem });
        }

        return (
            <div ref={ref} className={cn("relative w-full max-w-3xl space-y-3", className)} {...props}>
                <div
                    className={cn(
                        "relative flex min-h-[140px] w-full flex-col overflow-hidden rounded-[var(--r-1)] border border-border bg-card-bg p-4 shadow-[inset_0_1px_2px_var(--inset-light)]",
                        "transition-colors duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:border-primary/70 focus-within:ring-1 focus-within:ring-primary/30"
                    )}
                >
                    {attachments.length > 0 ? (
                        <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
                            {attachments.map((attachment) => (
                                <div key={attachment.id} className="group relative h-16 w-16 shrink-0">
                                    {attachment.previewUrl ? (
                                        <NextImage
                                            src={attachment.previewUrl}
                                            alt=""
                                            width={64}
                                            height={64}
                                            unoptimized
                                            className="h-16 w-16 rounded-[var(--r-1)] border border-border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--r-1)] border border-border bg-primary/10">
                                            <Paperclip className="h-5 w-5 text-text-secondary" aria-hidden="true" />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[var(--clay-porcelain)] opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                                        onClick={() => onRemoveAttachment?.(attachment.id)}
                                        aria-label={`Remove ${attachment.name}`}
                                    >
                                        <X className="h-3 w-3" aria-hidden="true" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <textarea
                        ref={textareaRef}
                        value={promptValue}
                        onChange={(event) => {
                            updateValue(event.target.value);
                            event.currentTarget.style.height = "auto";
                            event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 200)}px`;
                        }}
                        placeholder={placeholder}
                        rows={1}
                        disabled={disabled}
                        className="min-h-20 w-full resize-none bg-transparent p-2 text-base text-foreground outline-none placeholder:text-text-secondary/60 disabled:cursor-not-allowed"
                        onKeyDown={(event) => {
                            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                                event.preventDefault();
                                submitPrompt();
                            }
                        }}
                    />

                    <div className="mt-4 flex items-end justify-between gap-3">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <div className="relative">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "h-8 w-8 rounded-full p-0 text-text-secondary hover:bg-primary/10 hover:text-foreground",
                                        attachOpen && "bg-primary/10 text-foreground"
                                    )}
                                    onClick={() => setAttachOpen((open) => !open)}
                                >
                                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                                    <span className="sr-only">Attach reference</span>
                                </Button>

                                {attachOpen ? (
                                    <div className="absolute bottom-full left-0 z-dropdown mb-2 w-48 rounded-[var(--r-1)] border border-border bg-card-bg p-1 shadow-[var(--shadow-float)]">
                                        <button
                                            type="button"
                                            className="flex h-9 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm transition-colors hover:bg-primary/10"
                                            onClick={() => {
                                                setAttachOpen(false);
                                                onAttach?.("image/*");
                                            }}
                                        >
                                            <ImageIcon className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                                            Upload image
                                        </button>
                                        <button
                                            type="button"
                                            className="flex h-9 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm transition-colors hover:bg-primary/10"
                                            onClick={() => {
                                                setAttachOpen(false);
                                                onAttach?.("*");
                                            }}
                                        >
                                            <FileText className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                                            Upload file
                                        </button>
                                    </div>
                                ) : null}
                            </div>

                            <div className="h-4 w-px bg-border" />

                            <Select
                                className="h-8 w-auto min-w-28 rounded-[8px] py-1 pl-3 pr-8 text-xs"
                                value={framework}
                                onChange={(event) => onFrameworkChange?.(event.target.value)}
                            >
                                {frameworkOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                className="h-8 w-auto min-w-32 rounded-[8px] py-1 pl-3 pr-8 text-xs"
                                value={designSystem}
                                onChange={(event) => onDesignSystemChange?.(event.target.value)}
                            >
                                {designSystemOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>

                            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 text-text-secondary">
                                <Mic className="h-4 w-4" aria-hidden="true" />
                                <span className="sr-only">Record prompt</span>
                            </Button>
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            className={cn("h-8 w-8 rounded-full p-0", !canSubmit && "opacity-40")}
                            disabled={!canSubmit || disabled}
                            onClick={submitPrompt}
                        >
                            <ArrowUp className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Send prompt</span>
                        </Button>
                    </div>
                </div>

                <p className="text-center text-xs text-text-secondary/70">Clayface can make mistakes. Please review generated code.</p>
            </div>
        );
    }
);
PromptBox.displayName = "PromptBox";

export { PromptBox };
