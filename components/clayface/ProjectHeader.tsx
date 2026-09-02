import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "./PageHeader";
import { StatusPill } from "./StatusPill";

export interface ProjectHeaderProps {
    name: string;
    description?: string | null;
    status: string;
    backHref?: string;
}

export function ProjectHeader({ name, description, status, backHref = "/chat" }: ProjectHeaderProps) {
    return (
        <PageHeader
            eyebrow={
                <Badge variant="secondary" className="gap-2">
                    <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Project
                </Badge>
            }
            title={name}
            description={description || "No project description yet."}
            actions={
                <>
                    <StatusPill value={status} tone="accent" className="uppercase tracking-[0.14em]" />
                    <Link
                        href={backHref}
                        className="inline-flex h-9 items-center gap-1 rounded-[var(--r-1)] border border-border bg-background px-3 text-sm text-foreground transition-colors hover:border-primary/60"
                    >
                        Back to projects
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                </>
            }
        />
    );
}
