"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
    value: string;
    setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}

function useTabs() {
    const context = React.useContext(TabsContext);

    if (!context) {
        throw new Error("Tabs components must be used inside <Tabs>.");
    }

    return context;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, value, defaultValue = "", onValueChange, children, ...props }, ref) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue);
        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : internalValue;

        const setValue = React.useCallback(
            (nextValue: string) => {
                if (!isControlled) {
                    setInternalValue(nextValue);
                }

                onValueChange?.(nextValue);
            },
            [isControlled, onValueChange]
        );

        return (
            <TabsContext.Provider value={{ value: currentValue, setValue }}>
                <div ref={ref} className={cn("w-full", className)} {...props}>
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            role="tablist"
            className={cn(
                "inline-flex h-9 items-center gap-1 rounded-[var(--r-1)] border border-border bg-[var(--surface-tint)] p-1",
                className
            )}
            {...props}
        />
    )
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, onClick, ...props }, ref) => {
        const tabs = useTabs();
        const selected = tabs.value === value;

        return (
            <button
                ref={ref}
                type="button"
                role="tab"
                aria-selected={selected}
                data-state={selected ? "active" : "inactive"}
                className={cn(
                    "inline-flex h-7 items-center justify-center rounded-[8px] px-3 text-[13px] font-medium transition-colors duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    selected
                        ? "bg-card-bg text-foreground"
                        : "text-text-secondary hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                    className
                )}
                onClick={(event) => {
                    tabs.setValue(value);
                    onClick?.(event);
                }}
                {...props}
            />
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const tabs = useTabs();

        if (tabs.value !== value) {
            return null;
        }

        return (
            <div
                ref={ref}
                role="tabpanel"
                className={cn("mt-4 focus-visible:outline-none", className)}
                {...props}
            />
        );
    }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
