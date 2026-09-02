"use client";

import * as React from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastItem = {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
};

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
    toast: ToastItem;
    onDismiss?: (id: string) => void;
}

const toastMeta = {
    info: { icon: Info, className: "border-info/25" },
    success: { icon: CheckCircle2, className: "border-success/25" },
    warning: { icon: TriangleAlert, className: "border-warning/30" },
    error: { icon: XCircle, className: "border-error/30" },
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(({ className, toast, onDismiss, ...props }, ref) => {
    const variant = toast.variant ?? "info";
    const Icon = toastMeta[variant].icon;

    return (
        <div
            ref={ref}
            role={variant === "error" ? "alert" : "status"}
            className={cn(
                "grid w-[min(calc(100vw-32px),24rem)] grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-[var(--r-2)] border bg-bg-panel p-4 text-foreground shadow-[var(--shadow-float)] animate-imprint",
                toastMeta[variant].className,
                className
            )}
            {...props}
        >
            <Icon className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
            <div className="min-w-0">
                <p className="text-[14px] font-medium">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-[13px] leading-5 text-text-secondary">{toast.description}</p> : null}
            </div>
            {onDismiss ? (
                <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-[8px] text-text-secondary hover:bg-[var(--surface-tint)] hover:text-foreground"
                    onClick={() => onDismiss(toast.id)}
                    aria-label="Dismiss notification"
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
            ) : null}
        </div>
    );
});
Toast.displayName = "Toast";

export interface ToastViewportProps extends React.HTMLAttributes<HTMLDivElement> {
    toasts: ToastItem[];
    onDismiss?: (id: string) => void;
}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
    ({ className, toasts, onDismiss, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("fixed bottom-4 right-4 z-toast flex flex-col gap-2", className)}
            {...props}
        >
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    )
);
ToastViewport.displayName = "ToastViewport";

export { Toast, ToastViewport };
