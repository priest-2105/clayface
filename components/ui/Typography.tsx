import * as React from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: HeadingLevel;
    variant?: "title-1" | "title-2" | "title-3" | "title-4" | "subheading" | "display" | "hero";
}

const headingVariants = {
    hero: "text-hero",
    display: "text-display-xl",
    "title-1": "text-title-1",
    "title-2": "text-title-2",
    "title-3": "text-title-3",
    "title-4": "text-title-4",
    subheading: "text-subheading",
};

function Heading({ as: Component = "h2", variant = "title-2", className, ...props }: HeadingProps) {
    return <Component className={cn(headingVariants[variant], className)} {...props} />;
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    as?: "p" | "span" | "div";
    variant?: "body-lg" | "body" | "body-sm" | "caption" | "micro" | "label" | "label-sm" | "serif-note";
    tone?: "primary" | "secondary" | "tertiary" | "quaternary" | "accent" | "error" | "success" | "warning";
}

const textVariants = {
    "body-lg": "text-body-lg",
    body: "text-body",
    "body-sm": "text-body-sm",
    caption: "text-caption",
    micro: "text-micro",
    label: "text-label",
    "label-sm": "text-label-sm",
    "serif-note": "text-serif-note",
};

const toneClasses = {
    primary: "text-foreground",
    secondary: "text-text-secondary",
    tertiary: "text-text-tertiary",
    quaternary: "text-text-quaternary",
    accent: "text-primary",
    error: "text-error",
    success: "text-success",
    warning: "text-warning",
};

function Text({ as: Component = "p", variant = "body", tone = "primary", className, ...props }: TextProps) {
    return <Component className={cn(textVariants[variant], toneClasses[tone], className)} {...props} />;
}

export type KickerProps = React.HTMLAttributes<HTMLParagraphElement>;

const Kicker = React.forwardRef<HTMLParagraphElement, KickerProps>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-caps text-text-secondary", className)} {...props} />
));
Kicker.displayName = "Kicker";

export type CodeTextProps = React.HTMLAttributes<HTMLElement>;

const CodeText = React.forwardRef<HTMLElement, CodeTextProps>(({ className, ...props }, ref) => (
    <code ref={ref} className={cn("text-code rounded-[6px] bg-[var(--surface-tint)] px-1.5 py-0.5", className)} {...props} />
));
CodeText.displayName = "CodeText";

export { Heading, Text, Kicker, CodeText };
