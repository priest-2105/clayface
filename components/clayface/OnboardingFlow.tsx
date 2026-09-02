"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { OnboardingStep } from "./OnboardingStep";

export type OnboardingFlowStep = {
    id: string;
    title: string;
    description?: string;
    content: React.ReactNode;
};

export interface OnboardingFlowProps {
    steps: OnboardingFlowStep[];
    onComplete?: () => void;
}

export function OnboardingFlow({ steps, onComplete }: OnboardingFlowProps) {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeStep = steps[activeIndex];
    const isLast = activeIndex === steps.length - 1;

    return (
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <aside className="space-y-3">
                {steps.map((step, index) => (
                    <OnboardingStep
                        key={step.id}
                        index={index + 1}
                        title={step.title}
                        description={step.description}
                        active={index === activeIndex}
                        complete={index < activeIndex}
                    />
                ))}
            </aside>
            <section className="rounded-[var(--r-2)] border border-border bg-card-bg p-5">
                {activeStep?.content}
                <div className="mt-6 flex justify-between gap-2 border-t border-border pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={activeIndex === 0}
                        onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
                    >
                        Back
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            if (isLast) {
                                onComplete?.();
                                return;
                            }

                            setActiveIndex((index) => Math.min(steps.length - 1, index + 1));
                        }}
                    >
                        {isLast ? "Finish setup" : "Continue"}
                    </Button>
                </div>
            </section>
        </div>
    );
}
