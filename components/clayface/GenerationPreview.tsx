import * as React from "react";
import { Cpu, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface GenerationPreviewProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    componentName: string;
    description: string;
    files: string[];
    time?: string;
    active?: boolean;
}

const GenerationPreview = React.forwardRef<HTMLButtonElement, GenerationPreviewProps>(
    ({ className, componentName, description, files, time, active = false, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cn(
                "w-full rounded-[var(--r-3)] border p-4 text-left transition-colors duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                active ? "border-primary/30 bg-primary/10" : "border-border bg-background hover:border-primary/30",
                className
            )}
            {...props}
        >
            <div className="flex items-start gap-3">
                <span
                    className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border",
                        active ? "border-primary/30 bg-primary/15 text-primary" : "border-border bg-card-bg text-text-secondary"
                    )}
                >
                    <Cpu className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="truncate font-mono text-[14px] font-medium text-foreground">{componentName}</p>
                        {time ? <span className="shrink-0 text-[11px] text-text-secondary">{time}</span> : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-text-secondary">{description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {files.map((file) => (
                            <Badge key={file} variant="secondary" className="gap-1 font-mono text-[11px]">
                                <FileCode className="h-3 w-3" aria-hidden="true" />
                                {file}
                            </Badge>
                        ))}
                    </div>
                    {active ? (
                        <div className="mt-3 flex items-center gap-2 border-t border-border/70 pt-3">
                            <span className="h-1.5 w-2.5 rounded-full bg-primary animate-stretch" />
                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
                                Viewing in canvas
                            </span>
                        </div>
                    ) : null}
                </div>
            </div>
        </button>
    )
);
GenerationPreview.displayName = "GenerationPreview";

export { GenerationPreview };
