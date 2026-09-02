import * as React from "react";
import { ExternalLink, FileText, Frame, Link2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export type DesignSystemSourceType = "FIGMA" | "LINK" | "UPLOAD" | "OTHER";

export interface DesignSystemReferenceCardProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    description?: string | null;
    sourceType: DesignSystemSourceType;
    sourceUrl?: string | null;
    isPrimary?: boolean;
    actions?: React.ReactNode;
}

const sourceMeta = {
    FIGMA: { label: "Figma file", icon: Frame },
    LINK: { label: "Reference link", icon: Link2 },
    UPLOAD: { label: "Uploaded asset", icon: Upload },
    OTHER: { label: "Other reference", icon: FileText },
} as const;

export function DesignSystemReferenceCard({
    name,
    description,
    sourceType,
    sourceUrl,
    isPrimary = false,
    actions,
    ...props
}: DesignSystemReferenceCardProps) {
    const Icon = sourceMeta[sourceType].icon;

    return (
        <Card className="border border-border bg-card-bg p-4" {...props}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--r-1)] border border-border bg-background text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-foreground">{name}</h3>
                            {isPrimary ? (
                                <Badge className="uppercase tracking-[0.14em]">Primary</Badge>
                            ) : null}
                        </div>
                        <p className="mt-1 text-sm leading-5 text-text-secondary">{description || "No description yet."}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{sourceMeta[sourceType].label}</Badge>
                            {sourceUrl ? (
                                <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                    Open source
                                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
                {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
            </div>
        </Card>
    );
}
