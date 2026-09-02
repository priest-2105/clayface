import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
    <span className="relative block w-full">
        <select
            ref={ref}
            className={cn(
                "h-10 w-full appearance-none rounded-[var(--r-1)] border border-border bg-[var(--surface-tint)] px-3.5 py-2 pr-9 text-[14px] text-foreground",
                "transition-colors duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:border-border-strong",
                "focus-visible:border-primary focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--accent-tint),0_0_0_4px_var(--accent-tint-hover)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
        </select>
        <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
        />
    </span>
));
Select.displayName = "Select";

export { Select };
