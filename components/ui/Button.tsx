import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => {
        const isDisabled = disabled || loading;

        const baseStyles =
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

        const variants = {
            primary: "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-blue-500/20 hover:shadow-blue-400/30",
            secondary: "bg-card-bg/70 text-foreground border border-border hover:bg-primary/10 backdrop-blur-sm",
            outline: "border border-border bg-transparent backdrop-blur-sm hover:bg-primary/10 text-foreground transition-colors duration-200",
            ghost: "hover:bg-primary/10 text-foreground",
            destructive: "bg-red-500/80 text-white hover:bg-red-500/90 backdrop-blur-sm",
        };

        const sizes = {
            sm: "h-9 rounded-md px-3",
            md: "h-10 px-4 py-2",
            lg: "h-11 rounded-md px-8",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], loading && "cursor-wait", className)}
                ref={ref}
                aria-busy={loading || undefined}
                disabled={isDisabled}
                {...props}
            >
                {loading ? (
                    <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path
                                d="M22 12a10 10 0 0 1-10 10"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="opacity-75"
                            />
                        </svg>
                        {children}
                    </span>
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
