import * as React from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export type ActivityTimelineItem = {
    id: string;
    title: string;
    detail?: string | null;
    createdAt: Date | string;
};

export interface ActivityTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
    items: ActivityTimelineItem[];
}

const ActivityTimeline = React.forwardRef<HTMLDivElement, ActivityTimelineProps>(
    ({ className, items, ...props }, ref) => (
        <div ref={ref} className={cn("space-y-3", className)} {...props}>
            {items.length > 0 ? (
                items.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 rounded-[var(--r-1)] border border-border bg-background p-3">
                        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                                <span className="shrink-0 text-[11px] text-text-secondary">
                                    {new Date(activity.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {activity.detail ? <p className="mt-1 text-sm leading-5 text-text-secondary">{activity.detail}</p> : null}
                        </div>
                    </div>
                ))
            ) : (
                <EmptyState
                    className="min-h-36 rounded-[var(--r-1)]"
                    title="No activity yet"
                    description="Project changes and generated work will appear here."
                />
            )}
        </div>
    )
);
ActivityTimeline.displayName = "ActivityTimeline";

export { ActivityTimeline };
