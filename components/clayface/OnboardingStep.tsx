import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OnboardingStepProps extends React.HTMLAttributes<HTMLDivElement> {
    index: number;
    title: string;
    description?: string;
    active?: boolean;
    complete?: boolean;
}

const OnboardingStep = React.forwardRef<HTMLDivElement, OnboardingStepProps>(
    ({ className, index, title, description, active = false, complete = false, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-[var(--r-2)] border p-4 transition-colors",
                active || complete ? "border-primary/30 bg-primary/10" : "border-border bg-card-bg",
                className
            )}
            {...props}
        >
            <div className="flex items-start gap-3">
                <span
                    className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[12px]",
                        complete
                            ? "border-primary bg-primary text-[var(--clay-porcelain)]"
                            : active
                                ? "border-primary/40 bg-primary/15 text-primary"
                                : "border-border bg-background text-text-secondary"
                    )}
                >
                    {complete ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index}
                </span>
                <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-foreground">{title}</h3>
                    {description ? <p className="mt-1 text-[13px] leading-5 text-text-secondary">{description}</p> : null}
                    {children ? <div className="mt-4">{children}</div> : null}
                </div>
            </div>
        </div>
    )
);
OnboardingStep.displayName = "OnboardingStep";

export { OnboardingStep };
