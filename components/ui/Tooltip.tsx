import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
    content: React.ReactNode;
    side?: "top" | "bottom";
}

const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
    ({ className, content, side = "top", children, ...props }, ref) => (
        <span ref={ref} className={cn("group relative inline-flex", className)} {...props}>
            {children}
            <span
                role="tooltip"
                className={cn(
                    "pointer-events-none absolute left-1/2 z-tooltip w-max max-w-64 -translate-x-1/2 rounded-[8px] border border-border-standard bg-[var(--clay-kiln)] px-2.5 py-1.5 text-[12px] leading-4 text-[var(--clay-porcelain)] opacity-0 shadow-[var(--shadow-float)] transition-opacity duration-[160ms] group-hover:opacity-100 group-focus-within:opacity-100",
                    side === "top" ? "bottom-full mb-2" : "top-full mt-2"
                )}
            >
                {content}
            </span>
        </span>
    )
);
Tooltip.displayName = "Tooltip";

export { Tooltip };
