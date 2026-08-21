import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md px-3.5 py-3 text-[14px]",
                    "bg-[rgba(255,255,255,0.02)]",
                    "border border-border",
                    "placeholder:text-text-quaternary",
                    "focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_2px_rgba(94,106,210,0.4),0_0_0_4px_rgba(94,106,210,0.2)]",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-colors duration-[150ms]",
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
