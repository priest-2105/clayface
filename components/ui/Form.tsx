import * as React from "react";
import { cn } from "@/lib/utils";

const FormSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("rounded-[var(--r-2)] border border-border bg-card-bg p-4", className)}
            {...props}
        />
    )
);
FormSection.displayName = "FormSection";

const FormField = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn("grid gap-2", className)} {...props} />
);
FormField.displayName = "FormField";

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn("text-[14px] font-medium leading-none text-foreground", className)}
            {...props}
        />
    )
);
FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-[13px] leading-5 text-text-secondary", className)} {...props} />
    )
);
FormDescription.displayName = "FormDescription";

const FormError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            role="alert"
            className={cn(
                "rounded-[var(--r-1)] border border-error/25 bg-error/10 px-3 py-2 text-[14px] leading-5 text-error",
                className
            )}
            {...props}
        />
    )
);
FormError.displayName = "FormError";

const FormActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
    )
);
FormActions.displayName = "FormActions";

export { FormSection, FormField, FormLabel, FormDescription, FormError, FormActions };
