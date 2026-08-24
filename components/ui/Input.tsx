import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-[var(--r-1)] px-3.5 py-3 text-[14px]",
                    "bg-[var(--surface-tint)]",
                    "border border-border",
                    "placeholder:text-text-quaternary",
                    "focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_2px_var(--accent-tint),0_0_0_4px_var(--accent-tint-hover)]",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-colors duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
