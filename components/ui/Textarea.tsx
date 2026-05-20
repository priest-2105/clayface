import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-24 w-full rounded-lg px-3 py-2 text-sm",
                    "bg-white/50 dark:bg-blue-950/30",
                    "backdrop-blur-sm",
                    "border border-blue-200/50 dark:border-blue-800/40",
                    "placeholder:text-text-secondary/60",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/60",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-all duration-200",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };

