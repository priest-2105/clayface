import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
    label?: string;
    value: React.ReactNode;
    tone?: "neutral" | "accent" | "success" | "warning" | "error";
}

const tones = {
    neutral: "border-border bg-background text-text-secondary",
    accent: "border-primary/25 bg-primary/10 text-primary",
    success: "border-success/25 bg-success/10 text-success",
    warning: "border-warning/25 bg-warning/10 text-warning",
    error: "border-error/25 bg-error/10 text-error",
};

const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
    ({ className, label, value, tone = "neutral", ...props }, ref) => (
        <span
            ref={ref}
            className={cn(
                "inline-flex h-7 shrink-0 items-center gap-2 rounded-full border px-3 text-[12px] font-medium",
                tones[tone],
                className
            )}
            {...props}
        >
            {label ? <span className="uppercase tracking-[0.16em] opacity-75">{label}</span> : null}
            {label ? <span className="h-1 w-1 rounded-full bg-current opacity-40" /> : null}
            <span className={label ? "text-foreground" : undefined}>{value}</span>
        </span>
    )
);
StatusPill.displayName = "StatusPill";

export { StatusPill };
