"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
    titleId: string;
    descriptionId: string;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

export interface DialogProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

function useDialog() {
    const context = React.useContext(DialogContext);

    if (!context) {
        throw new Error("Dialog components must be used inside <Dialog>.");
    }

    return context;
}

function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const titleId = React.useId();
    const descriptionId = React.useId();
    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : internalOpen;

    const setOpen = React.useCallback(
        (nextOpen: boolean) => {
            if (!isControlled) {
                setInternalOpen(nextOpen);
            }

            onOpenChange?.(nextOpen);
        },
        [isControlled, onOpenChange]
    );

    return (
        <DialogContext.Provider value={{ open: currentOpen, setOpen, titleId, descriptionId }}>
            {children}
        </DialogContext.Provider>
    );
}

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
    ({ className, onClick, asChild = false, children, ...props }, ref) => {
        const dialog = useDialog();
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            dialog.setOpen(true);
            onClick?.(event);
        };

        if (asChild && React.isValidElement<{ onClick?: React.MouseEventHandler<HTMLButtonElement>; className?: string }>(children)) {
            return React.cloneElement(children, {
                onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                    dialog.setOpen(true);
                    children.props.onClick?.(event);
                },
            });
        }

        return (
            <button
                ref={ref}
                type="button"
                className={cn("cursor-default", className)}
                onClick={handleClick}
                {...props}
            >
                {children}
            </button>
        );
    }
);
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(
    ({ className, children, onCancel, onClick, ...props }, forwardedRef) => {
        const dialog = useDialog();
        const localRef = React.useRef<HTMLDialogElement | null>(null);

        React.useImperativeHandle(forwardedRef, () => localRef.current as HTMLDialogElement);

        React.useEffect(() => {
            const node = localRef.current;

            if (!node) {
                return;
            }

            if (dialog.open && !node.open) {
                node.showModal();
            }

            if (!dialog.open && node.open) {
                node.close();
            }
        }, [dialog.open]);

        return (
            <dialog
                ref={localRef}
                aria-labelledby={dialog.titleId}
                aria-describedby={dialog.descriptionId}
                className={cn(
                    "fixed left-1/2 top-1/2 z-modal m-0 w-[min(calc(100vw-32px),34rem)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--r-2)] border border-border-standard bg-bg-panel p-0 text-foreground shadow-[var(--shadow-float)] backdrop:bg-[rgba(42,38,35,0.5)]",
                    "open:animate-imprint",
                    className
                )}
                onCancel={(event) => {
                    dialog.setOpen(false);
                    onCancel?.(event);
                }}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        dialog.setOpen(false);
                    }

                    onClick?.(event);
                }}
                {...props}
            >
                {children}
            </dialog>
        );
    }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("space-y-1.5 p-6 pb-3", className)} {...props} />
    )
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        const dialog = useDialog();

        return (
            <h2
                ref={ref}
                id={dialog.titleId}
                className={cn("text-[20px] font-medium tracking-[-0.01em] text-foreground", className)}
                {...props}
            />
        );
    }
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => {
        const dialog = useDialog();

        return (
            <p
                ref={ref}
                id={dialog.descriptionId}
                className={cn("text-[14px] leading-6 text-text-secondary", className)}
                {...props}
            />
        );
    }
);
DialogDescription.displayName = "DialogDescription";

const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-3", className)} {...props} />
);
DialogBody.displayName = "DialogBody";

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col-reverse gap-2 p-6 pt-3 sm:flex-row sm:justify-end", className)} {...props} />
    )
);
DialogFooter.displayName = "DialogFooter";

const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, onClick, children, ...props }, ref) => {
        const dialog = useDialog();

        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-text-secondary transition-colors hover:bg-[var(--surface-tint)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                    className
                )}
                onClick={(event) => {
                    dialog.setOpen(false);
                    onClick?.(event);
                }}
                {...props}
            >
                {children ?? <X className="h-4 w-4" aria-hidden="true" />}
            </button>
        );
    }
);
DialogClose.displayName = "DialogClose";

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogClose,
};
