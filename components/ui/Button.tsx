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
            "font-ui inline-flex items-center justify-center whitespace-nowrap rounded-md text-[14px] ring-offset-background transition-colors duration-[150ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-default";

        const variants = {
            primary: "bg-primary text-white border border-[var(--accent-border)] shadow-[var(--shadow-button)] hover:bg-primary-hover hover:border-primary-hover",
            secondary: "bg-[rgba(255,255,255,0.02)] text-text-secondary border border-border hover:bg-[rgba(255,255,255,0.05)]",
            outline: "border border-border-standard bg-transparent text-text-secondary hover:bg-[rgba(255,255,255,0.05)] hover:border-border-strong",
            ghost: "text-text-tertiary hover:bg-[rgba(255,255,255,0.05)] hover:text-text-secondary",
            destructive: "bg-error text-white hover:bg-red-500",
        };

        const sizes = {
            sm: "h-8 rounded px-3 text-[13px]",
            md: "h-9 px-4 py-2",
            lg: "h-10 px-5",
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
