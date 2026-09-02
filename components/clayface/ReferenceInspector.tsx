import * as React from "react";
import { BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export type ReferenceInspectorRow = {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
};

export interface ReferenceInspectorProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    rows: ReferenceInspectorRow[];
    payload?: unknown;
}

export function ReferenceInspector({ title = "Selection summary", rows, payload, ...props }: ReferenceInspectorProps) {
    return (
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]" {...props}>
            <Card className="border border-border bg-background">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-text-secondary">
                        <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                    {rows.map((row) => (
                        <div key={row.label} className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-b-0">
                            <span className="text-sm text-text-secondary">{row.label}</span>
                            <span className={row.mono ? "font-mono text-right text-xs text-foreground" : "text-right text-sm text-foreground"}>
                                {row.value}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {payload !== undefined ? (
                <Card className="border border-border bg-background">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-[0.18em] text-text-secondary">Raw API payload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="max-h-96 overflow-auto font-mono text-xs leading-6 text-foreground">
                            {JSON.stringify(payload, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
