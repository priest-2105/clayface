"use client";

import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger, type PopoverContentProps, type PopoverProps } from "./Popover";

type DropdownContextValue = {
    close: () => void;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdown() {
    const context = React.useContext(DropdownContext);

    if (!context) {
        throw new Error("DropdownMenu items must be used inside <DropdownMenu>.");
    }

    return context;
}

function DropdownMenu({ children, onOpenChange, ...props }: PopoverProps) {
    const [open, setOpen] = React.useState(props.defaultOpen ?? false);

    return (
        <DropdownContext.Provider value={{ close: () => setOpen(false) }}>
            <Popover
                {...props}
                open={props.open ?? open}
                onOpenChange={(nextOpen) => {
                    if (props.open === undefined) {
                        setOpen(nextOpen);
                    }

                    onOpenChange?.(nextOpen);
                }}
            >
                {children}
            </Popover>
        </DropdownContext.Provider>
    );
}

const DropdownMenuTrigger = PopoverTrigger;

const DropdownMenuContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
    ({ className, ...props }, ref) => (
        <PopoverContent
            ref={ref}
            className={cn("min-w-48 p-1", className)}
            {...props}
        />
    )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    inset?: boolean;
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
    ({ className, inset, onClick, ...props }, ref) => {
        const dropdown = useDropdown();

        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    "flex h-9 w-full items-center gap-2 rounded-[8px] px-2.5 text-left text-[14px] text-foreground transition-colors hover:bg-[var(--surface-tint)] focus-visible:bg-[var(--surface-tint)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                    inset && "pl-8",
                    className
                )}
                onClick={(event) => {
                    dropdown.close();
                    onClick?.(event);
                }}
                {...props}
            />
        );
    }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
    HTMLButtonElement,
    DropdownMenuItemProps & { checked?: boolean }
>(({ className, checked, children, ...props }, ref) => (
    <DropdownMenuItem ref={ref} className={cn("pl-8", className)} {...props}>
        <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
            {checked ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> : null}
        </span>
        {children}
    </DropdownMenuItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("px-2.5 py-2 text-[12px] font-medium text-text-secondary", className)}
            {...props}
        />
    )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
    )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, ...props }, ref) => (
        <span ref={ref} className={cn("ml-auto text-[12px] text-text-tertiary", className)} {...props} />
    )
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

const DropdownMenuSubHint = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, ...props }, ref) => (
        <span ref={ref} className={cn("ml-auto text-text-tertiary", className)} {...props}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
    )
);
DropdownMenuSubHint.displayName = "DropdownMenuSubHint";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSubHint,
};
