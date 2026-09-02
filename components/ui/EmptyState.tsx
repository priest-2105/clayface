import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({ className, icon, title, description, action, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex min-h-48 flex-col items-center justify-center rounded-[var(--r-2)] border border-dashed border-border-standard bg-[var(--surface-tint)] px-6 py-8 text-center",
                className
            )}
            {...props}
        >
            {icon ? (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--r-1)] border border-border bg-card-bg text-primary">
                    {icon}
                </div>
            ) : null}
            <h3 className="text-[18px] font-medium tracking-[-0.01em] text-foreground">{title}</h3>
            {description ? (
                <p className="mt-2 max-w-md text-[14px] leading-6 text-text-secondary">{description}</p>
            ) : null}
            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    )
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
