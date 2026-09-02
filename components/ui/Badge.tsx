import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "secondary" | "success" | "warning" | "error" | "outline";
}

const variants = {
    default: "border-primary/25 bg-primary/10 text-primary",
    secondary: "border-border bg-[var(--surface-tint)] text-text-secondary",
    success: "border-success/25 bg-success/10 text-success",
    warning: "border-warning/25 bg-warning/10 text-warning",
    error: "border-error/25 bg-error/10 text-error",
    outline: "border-border-standard bg-transparent text-foreground",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", ...props }, ref) => (
        <span
            ref={ref}
            className={cn(
                "inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-[12px] font-medium leading-none",
                variants[variant],
                className
            )}
            {...props}
        />
    )
);
Badge.displayName = "Badge";

export { Badge };
