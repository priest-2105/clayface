"use client";

import * as React from "react";
import { Check, Copy, Download, FileCode } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

export type CodePreviewFile = {
    name: string;
    language?: string;
    code: string;
};

export interface CodePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
    files: CodePreviewFile[];
    title?: string;
    preview?: React.ReactNode;
    onExport?: () => void;
}

function highlightLine(line: string) {
    if (/^\s*\/\//.test(line)) {
        return <span className="text-text-secondary">{line}</span>;
    }

    const parts: React.ReactNode[] = [];
    const tokenRe =
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:import|export|default|from|const|let|var|return|function|interface|type|class|extends|implements|as|if|else|for|while|of|in|new)\b)|(<\/?[A-Z][a-zA-Z]*)|(\b[A-Z][a-zA-Z]+\b)/g;
    let lastIndex = 0;
    let key = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRe.exec(line)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={key++}>{line.slice(lastIndex, match.index)}</span>);
        }

        parts.push(
            <span key={key++} className={match[1] || match[2] ? "text-primary" : "text-foreground"}>
                {match[0]}
            </span>
        );
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
        parts.push(<span key={key++}>{line.slice(lastIndex)}</span>);
    }

    return parts;
}

const CodePreview = React.forwardRef<HTMLDivElement, CodePreviewProps>(
    ({ className, files, title = "Generated output", preview, onExport, ...props }, ref) => {
        const [activeFileName, setActiveFileName] = React.useState(files[0]?.name ?? "");
        const [tab, setTab] = React.useState(preview ? "preview" : "code");
        const [copied, setCopied] = React.useState(false);
        const activeFile = files.find((file) => file.name === activeFileName) ?? files[0];

        React.useEffect(() => {
            if (files.length > 0 && !files.some((file) => file.name === activeFileName)) {
                setActiveFileName(files[0].name);
            }
        }, [activeFileName, files]);

        async function copyCode() {
            if (!activeFile) {
                return;
            }

            await navigator.clipboard.writeText(activeFile.code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "flex min-h-0 flex-col overflow-hidden rounded-[var(--r-2)] border border-border bg-background",
                    className
                )}
                {...props}
            >
                <div className="flex min-h-14 shrink-0 items-center gap-2 border-b border-border bg-card-bg px-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-border bg-background text-primary">
                            <FileCode className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-[14px] font-medium text-foreground">{title}</p>
                            <p className="truncate font-mono text-[11px] text-text-secondary">
                                {activeFile?.name ?? "No file selected"}
                            </p>
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        <Tabs value={tab} onValueChange={setTab}>
                            <TabsList className="h-8">
                                <TabsTrigger value="code">Code</TabsTrigger>
                                {preview ? <TabsTrigger value="preview">Preview</TabsTrigger> : null}
                            </TabsList>
                        </Tabs>
                        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5" onClick={copyCode}>
                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied ? "Copied" : "Copy"}
                        </Button>
                        {onExport ? (
                            <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onExport}>
                                <Download className="h-3.5 w-3.5" />
                                Export
                            </Button>
                        ) : null}
                    </div>
                </div>

                {files.length > 1 ? (
                    <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border bg-card-bg px-3 py-2">
                        {files.map((file) => (
                            <button
                                key={file.name}
                                type="button"
                                className={cn(
                                    "rounded-[8px] px-3 py-1.5 font-mono text-[12px] transition-colors",
                                    activeFileName === file.name
                                        ? "bg-background text-foreground"
                                        : "text-text-secondary hover:bg-background hover:text-foreground"
                                )}
                                onClick={() => setActiveFileName(file.name)}
                            >
                                {file.name}
                            </button>
                        ))}
                    </div>
                ) : null}

                {tab === "preview" && preview ? (
                    <div className="min-h-0 flex-1 overflow-auto">{preview}</div>
                ) : (
                    <pre className="min-h-0 flex-1 overflow-auto p-5 font-mono text-[13px] leading-6 text-foreground">
                        {activeFile?.code.split("\n").map((line, index) => (
                            <div key={index} className="table-row">
                                <span className="table-cell select-none pr-5 text-right text-text-secondary">{index + 1}</span>
                                <span className="table-cell whitespace-pre">{highlightLine(line)}</span>
                            </div>
                        ))}
                    </pre>
                )}
            </div>
        );
    }
);
CodePreview.displayName = "CodePreview";

export { CodePreview };
