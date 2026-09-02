import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "info" | "success" | "warning" | "error";
}

const variants = {
    info: {
        className: "border-info/25 bg-info/10 text-foreground",
        icon: Info,
    },
    success: {
        className: "border-success/25 bg-success/10 text-foreground",
        icon: CheckCircle2,
    },
    warning: {
        className: "border-warning/30 bg-warning/10 text-foreground",
        icon: TriangleAlert,
    },
    error: {
        className: "border-error/30 bg-error/10 text-foreground",
        icon: AlertCircle,
    },
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = "info", children, ...props }, ref) => {
        const Icon = variants[variant].icon;

        return (
            <div
                ref={ref}
                role={variant === "error" ? "alert" : "status"}
                className={cn(
                    "flex gap-3 rounded-[var(--r-1)] border px-4 py-3 text-[14px] leading-5",
                    variants[variant].className,
                    className
                )}
                {...props}
            >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-current" aria-hidden="true" />
                <div className="min-w-0">{children}</div>
            </div>
        );
    }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("font-medium text-foreground", className)} {...props} />
    )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("mt-1 text-text-secondary", className)} {...props} />
    )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
