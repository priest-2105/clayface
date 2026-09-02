import * as React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        type="checkbox"
        className={cn(
            "h-4 w-4 shrink-0 rounded-[5px] border border-border-standard bg-[var(--surface-tint)] accent-[var(--accent)]",
            "transition-colors duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            "hover:border-primary/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    />
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
