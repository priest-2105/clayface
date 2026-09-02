import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
    ({ className, eyebrow, title, description, actions, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}
            {...props}
        >
            <div className="min-w-0 space-y-2">
                {eyebrow ? <div>{eyebrow}</div> : null}
                <div>
                    <h1 className="font-heading text-[32px] font-semibold leading-tight tracking-[-0.02em] text-foreground">
                        {title}
                    </h1>
                    {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{description}</p> : null}
                </div>
            </div>
            {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
    )
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
