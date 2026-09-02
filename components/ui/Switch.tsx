"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "defaultChecked" | "onChange"> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked, defaultChecked = false, onCheckedChange, disabled, onClick, ...props }, ref) => {
        const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
        const isControlled = checked !== undefined;
        const isChecked = isControlled ? checked : internalChecked;

        return (
            <button
                ref={ref}
                type="button"
                role="switch"
                aria-checked={isChecked}
                disabled={disabled}
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isChecked
                        ? "border-primary bg-primary"
                        : "border-border-standard bg-[var(--surface-tint)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                onClick={(event) => {
                    const nextChecked = !isChecked;

                    if (!isControlled) {
                        setInternalChecked(nextChecked);
                    }

                    onCheckedChange?.(nextChecked);
                    onClick?.(event);
                }}
                {...props}
            >
                <span
                    className={cn(
                        "block h-5 w-5 rounded-full bg-[var(--clay-porcelain)] shadow-[0_1px_2px_rgba(42,38,35,0.18)] transition-transform duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isChecked ? "translate-x-[19px]" : "translate-x-0.5"
                    )}
                />
            </button>
        );
    }
);
Switch.displayName = "Switch";

export { Switch };
