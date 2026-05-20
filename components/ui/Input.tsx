import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-lg px-3 py-2 text-sm",
                    "bg-card-bg/80",
                    "backdrop-blur-sm",
                    "border border-border",
                    "placeholder:text-text-secondary/60",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/60",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-all duration-200",
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
