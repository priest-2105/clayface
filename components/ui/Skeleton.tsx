import * as React from "react";
import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "animate-pulse rounded-[var(--r-1)] bg-[rgba(42,38,35,0.08)]",
            className
        )}
        {...props}
    />
));
Skeleton.displayName = "Skeleton";

export { Skeleton };
