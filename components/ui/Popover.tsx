"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type PopoverContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function usePopover() {
    const context = React.useContext(PopoverContext);

    if (!context) {
        throw new Error("Popover components must be used inside <Popover>.");
    }

    return context;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
    ({ className, open, defaultOpen = false, onOpenChange, children, ...props }, ref) => {
        const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
        const rootRef = React.useRef<HTMLDivElement | null>(null);
        const isControlled = open !== undefined;
        const currentOpen = isControlled ? open : internalOpen;

        React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

        const setOpen = React.useCallback(
            (nextOpen: boolean) => {
                if (!isControlled) {
                    setInternalOpen(nextOpen);
                }

                onOpenChange?.(nextOpen);
            },
            [isControlled, onOpenChange]
        );

        React.useEffect(() => {
            function handlePointerDown(event: PointerEvent) {
                if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                    setOpen(false);
                }
            }

            document.addEventListener("pointerdown", handlePointerDown);
            return () => document.removeEventListener("pointerdown", handlePointerDown);
        }, [setOpen]);

        return (
            <PopoverContext.Provider value={{ open: currentOpen, setOpen }}>
                <div ref={rootRef} className={cn("relative inline-block", className)} {...props}>
                    {children}
                </div>
            </PopoverContext.Provider>
        );
    }
);
Popover.displayName = "Popover";

const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, onClick, ...props }, ref) => {
        const popover = usePopover();

        return (
            <button
                ref={ref}
                type="button"
                aria-expanded={popover.open}
                className={cn("cursor-default", className)}
                onClick={(event) => {
                    popover.setOpen(!popover.open);
                    onClick?.(event);
                }}
                {...props}
            />
        );
    }
);
PopoverTrigger.displayName = "PopoverTrigger";

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "start" | "center" | "end";
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
    ({ className, align = "center", ...props }, ref) => {
        const popover = usePopover();

        if (!popover.open) {
            return null;
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute top-full z-dropdown mt-2 min-w-56 rounded-[var(--r-1)] border border-border-standard bg-bg-panel p-2 text-foreground shadow-[var(--shadow-float)] animate-imprint",
                    align === "start" && "left-0",
                    align === "center" && "left-1/2 -translate-x-1/2",
                    align === "end" && "right-0",
                    className
                )}
                {...props}
            />
        );
    }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
