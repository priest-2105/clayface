import * as React from "react";
import { cn } from "@/lib/utils";

export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: React.ReactNode;
    detail?: React.ReactNode;
    compact?: boolean;
}

const MetricTile = React.forwardRef<HTMLDivElement, MetricTileProps>(
    ({ className, label, value, detail, compact = false, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-[var(--r-1)] border border-border bg-background",
                compact ? "p-3" : "p-4",
                className
            )}
            {...props}
        >
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-secondary">{label}</p>
            <p className={cn("mt-1 font-semibold text-foreground", compact ? "text-lg" : "text-2xl")}>{value}</p>
            {detail ? <p className="mt-1 text-[12px] leading-5 text-text-secondary">{detail}</p> : null}
        </div>
    )
);
MetricTile.displayName = "MetricTile";

export { MetricTile };
