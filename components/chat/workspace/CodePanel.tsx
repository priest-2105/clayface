"use client";

import { useState } from "react";
import { Check, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CodePreview } from "@/components/clayface";
import { cn } from "@/lib/utils";

const GENERATION_CODE: Record<number, { files: Record<string, string>; activeFile: string }> = {
    0: {
        activeFile: "PricingTable.tsx",
        files: {
            "PricingTable.tsx": `import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/Card"
import { plans } from "./pricing.config"

export default function PricingTable() {
  return (
    <div className="grid grid-cols-3 gap-6 w-full max-w-5xl mx-auto py-12">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.highlighted ? "ring-2 ring-primary relative" : "relative"}>
          {plan.highlighted && (
            <div className="absolute -top-3 inset-x-0 flex justify-center">
              <span className="bg-primary text-[var(--clay-porcelain)] text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="text-title-1 mt-2">
              {plan.price}
              <span className="text-body-sm text-text-secondary">/mo</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-body-sm">
                  <Check className="w-4 h-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={plan.highlighted ? "primary" : "outline"}>
              {plan.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}`,
            "pricing.config.ts": `export const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for side projects",
    features: ["5 projects", "10k generations / mo", "Community support"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professional developers",
    features: ["Unlimited projects", "100k generations / mo", "Priority support", "Custom design systems"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For teams and organizations",
    features: ["Everything in Pro", "SSO & audit logs", "Dedicated support", "SLA guarantee"],
    cta: "Contact sales",
    highlighted: false,
  },
]`,
        },
    },
    1: {
        activeFile: "PricingTable.tsx",
        files: {
            "PricingTable.tsx": `"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/Card"
import { plans } from "./pricing.config"

export default function PricingTable() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")

  return (
    <div className="flex flex-col items-center gap-10 py-12">
      <BillingToggle value={billing} onChange={setBilling} />
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.highlighted ? "ring-2 ring-primary relative" : "relative"}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-title-1 mt-2">
                \${billing === "monthly" ? plan.price.monthly : plan.price.annual}
                <span className="text-body-sm text-text-secondary">/mo</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}`,
            "BillingToggle.tsx": `interface BillingToggleProps {
  value: "monthly" | "annual"
  onChange: (value: "monthly" | "annual") => void
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-1 text-body-sm">
      {(["monthly", "annual"] as const).map((item) => (
        <button key={item} onClick={() => onChange(item)}>
          {item}
        </button>
      ))}
    </div>
  )
}`,
            "pricing.config.ts": `export const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    annualSavings: 0,
    description: "Perfect for side projects",
    features: ["5 projects", "10k generations / mo", "Community support"],
    cta: "Get started",
    highlighted: false,
  },
]`,
        },
    },
};

function PricingPreview({ withToggle }: { withToggle: boolean }) {
    const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

    const plans = [
        {
            name: "Free",
            price: { monthly: "$0", annual: "$0" },
            desc: "Perfect for side projects",
            features: ["5 projects", "10k generations/mo", "Community support"],
            cta: "Get started",
            highlighted: false,
        },
        {
            name: "Pro",
            price: { monthly: "$29", annual: "$23" },
            desc: "For professional developers",
            features: ["Unlimited projects", "100k gen/mo", "Priority support", "Custom systems"],
            cta: "Start free trial",
            highlighted: true,
        },
        {
            name: "Enterprise",
            price: { monthly: "$99", annual: "$79" },
            desc: "For teams and organizations",
            features: ["Everything in Pro", "SSO & audit logs", "Dedicated support", "SLA guarantee"],
            cta: "Contact sales",
            highlighted: false,
        },
    ];

    return (
        <div className="flex w-full flex-col items-center gap-8 px-6 py-10">
            {withToggle && (
                <div className="flex items-center gap-1 rounded-full border border-border bg-card-bg p-1 text-body-sm">
                    {(["monthly", "annual"] as const).map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setBilling(item)}
                            className={cn(
                                "rounded-full px-4 py-1.5 text-body-sm capitalize transition-colors",
                                billing === item ? "bg-background font-medium text-foreground" : "text-text-secondary hover:text-foreground"
                            )}
                        >
                            {item}
                            {item === "annual" && <span className="ml-1.5 text-label-sm text-primary">-20%</span>}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={cn(
                            "relative flex flex-col rounded-[var(--r-2)] border bg-card-bg p-5 transition-colors",
                            plan.highlighted ? "border-primary/60" : "border-border"
                        )}
                    >
                        {plan.highlighted && (
                            <div className="absolute -top-3 inset-x-0 flex justify-center">
                                <span className="rounded-full bg-primary px-3 py-0.5 text-label-sm text-[var(--clay-porcelain)]">
                                    Most Popular
                                </span>
                            </div>
                        )}
                        <div className="mb-4">
                            <p className="text-subheading text-foreground">{plan.name}</p>
                            <p className="mt-0.5 text-caption">{plan.desc}</p>
                            <div className="mt-3 text-title-2 text-foreground">
                                {plan.price[billing]}
                                <span className="text-body-sm font-normal text-text-secondary">/mo</span>
                            </div>
                            {withToggle && billing === "annual" && plan.highlighted && (
                                <p className="mt-0.5 text-label-sm text-primary">Save 20% annually</p>
                            )}
                        </div>
                        <ul className="mb-4 flex-1 space-y-1.5">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-1.5 text-caption">
                                    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                                        <Check className="h-2 w-2 text-primary" />
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            className={cn(
                                "w-full rounded-[var(--r-1)] py-2 text-label transition-colors",
                                plan.highlighted
                                    ? "bg-primary text-[var(--clay-porcelain)] hover:bg-primary-hover"
                                    : "border border-border text-foreground hover:border-primary/60"
                            )}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface CodePanelProps {
    activeGenId: number;
    threadOpen: boolean;
    onOpenThread: () => void;
}

export function CodePanel({ activeGenId, threadOpen, onOpenThread }: CodePanelProps) {
    const gen = GENERATION_CODE[activeGenId] ?? GENERATION_CODE[0];
    const files = Object.entries(gen.files).map(([name, code]) => ({ name, code }));

    return (
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
            <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card-bg px-4">
                {!threadOpen && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onOpenThread}
                        className="mr-1 h-8 w-8 p-0 text-text-secondary"
                        title="Open thread"
                    >
                        <PanelLeftOpen className="h-4 w-4" />
                    </Button>
                )}
                <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-border bg-background text-primary">
                        <Check className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-label text-foreground">Generated canvas</p>
                        <p className="truncate text-code-sm text-text-secondary">{gen.activeFile}</p>
                    </div>
                </div>
            </div>

            <CodePreview
                className="min-h-0 flex-1 rounded-none border-0"
                title="PricingTable"
                files={files}
                preview={
                    <div className="h-full overflow-auto bg-background">
                        <div className="sticky top-0 z-sticky flex items-center justify-between border-b border-border bg-card-bg px-4 py-2">
                            <span className="text-code-sm text-text-secondary">PricingTable - Live Preview</span>
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-border" />
                                <div className="h-2 w-2 rounded-full bg-border" />
                                <div className="h-2 w-2 rounded-full bg-border" />
                            </div>
                        </div>
                        <PricingPreview withToggle={activeGenId === 1} />
                    </div>
                }
            />
        </div>
    );
}
