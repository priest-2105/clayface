"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
    loading?: boolean;
}

type CrackPath = { d: string; width: number };

function randBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function pointsToPath(points: [number, number][]): string {
    return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

// A different fracture every time, not the same hardcoded lines: a jagged main
// split at a random height, a secondary fissure crossing it at a random
// junction, and a random scatter of thin hairline branches off both — real
// fractures aren't two clean repeatable strokes, they're a main break plus a
// spray of smaller ones that differs impact to impact. Drawn in a wide viewBox
// and stretched to fill whatever size the button is. pathLength="1" lets
// stroke-dasharray/dashoffset be expressed as a plain 0–1 fraction instead of
// needing each path's real length. A shared feTurbulence/feDisplacementMap
// filter (applied where this is rendered) roughens the drawn lines further.
function generateCrackPaths(): CrackPath[] {
    const paths: CrackPath[] = [];

    const steps = 7 + Math.floor(Math.random() * 3);
    const startX = randBetween(4, 16);
    const endX = randBetween(184, 196);
    const baseY = randBetween(18, 42);
    const mainPoints: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
        const x = startX + ((endX - startX) * i) / steps;
        const y = baseY + randBetween(-14, 14);
        mainPoints.push([x, y]);
    }
    paths.push({ d: pointsToPath(mainPoints), width: randBetween(1.4, 1.9) });

    const junctionIndex = 2 + Math.floor(Math.random() * Math.max(1, mainPoints.length - 4));
    const [jx, jy] = mainPoints[junctionIndex];
    const secondarySteps = 3 + Math.floor(Math.random() * 2);
    const secondaryPoints: [number, number][] = [[jx, jy]];
    let cx = jx;
    let cy = jy;
    const dir = Math.random() < 0.5 ? -1 : 1;
    for (let i = 0; i < secondarySteps; i++) {
        cx += randBetween(-8, 8);
        cy += dir * randBetween(8, 16);
        secondaryPoints.push([cx, cy]);
    }
    paths.push({ d: pointsToPath(secondaryPoints), width: randBetween(1.0, 1.4) });

    const junctions = [...mainPoints, ...secondaryPoints];
    const branchCount = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < branchCount; i++) {
        const [bx, by] = junctions[Math.floor(Math.random() * junctions.length)];
        const angle = randBetween(0, Math.PI * 2);
        const len = randBetween(6, 14);
        const ex = bx + Math.cos(angle) * len;
        const ey = by + Math.sin(angle) * len;
        paths.push({
            d: pointsToPath([
                [bx, by],
                [ex, ey],
            ]),
            width: randBetween(0.4, 0.8),
        });
    }

    return paths;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            loading = false,
            disabled,
            children,
            onMouseEnter,
            onMouseLeave,
            onMouseDown,
            onMouseUp,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;
        const isPrimary = variant === "primary";
        // Sanitized because React's useId() includes colons, which aren't safe
        // inside an SVG url(#id) reference.
        const crackFilterId = `crack-rough-${React.useId().replace(/:/g, "")}`;

        const [isHovering, setIsHovering] = React.useState(false);
        const [isCracking, setIsCracking] = React.useState(false);
        const [sheenPos, setSheenPos] = React.useState("50% 50%");
        const [crackPaths, setCrackPaths] = React.useState<CrackPath[]>(() => generateCrackPaths());
        const hoverVideoRef = React.useRef<HTMLVideoElement>(null);

        // `isolate` gives the button its own stacking context, so the media layer's
        // -z-10 and the crack overlay's positioned z:auto both stay confined to
        // painting behind/above this button's own content, not some distant ancestor.
        const baseStyles =
            "relative isolate font-ui inline-flex items-center justify-center whitespace-nowrap rounded-[var(--r-1)] text-[14px] ring-offset-background transition-[transform,colors] duration-[120ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 cursor-default";

        const variants = {
            // Background is a material layer (dry clay → wet clay → cracked) instead
            // of a flat fill.
            primary: "border border-[var(--accent-border)] shadow-[var(--shadow-button)] text-[var(--clay-porcelain)] ",
            secondary: "bg-[var(--surface-tint)] text-text-secondary border border-border",
            outline: "border border-border-standard bg-transparent text-text-secondary hover:bg-[var(--surface-tint)] hover:border-border-strong",
            ghost: "text-text-tertiary hover:bg-[var(--surface-tint)] hover:text-text-secondary",
            destructive: "bg-error text-[var(--clay-porcelain)] hover:opacity-90",
        };

        const sizes = {
            sm: "h-8 rounded px-3 text-[13px]",
            md: "h-9 px-4 py-2",
            lg: "h-10 px-5",
        };

        return (
            <button
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    loading && "cursor-wait",
                    isPrimary && isCracking && "animate-crack-jolt",
                    className
                )}
                ref={ref}
                aria-busy={loading || undefined}
                disabled={isDisabled}
                onMouseMove={(event) => {
                    if (isPrimary) {
                        const rect = event.currentTarget.getBoundingClientRect();
                        const x = ((event.clientX - rect.left) / rect.width) * 100;
                        const y = ((event.clientY - rect.top) / rect.height) * 100;
                        setSheenPos(`${x}% ${y}%`);
                    }
                }}
                onMouseEnter={(event) => {
                    if (isPrimary) {
                        setIsHovering(true);
                        const video = hoverVideoRef.current;
                        if (video) {
                            video.currentTime = 0;
                            video.play().catch(() => {});
                        }
                    }
                    onMouseEnter?.(event);
                }}
                onMouseLeave={(event) => {
                    if (isPrimary) {
                        // Stop everything immediately — no lingering crack, video, or
                        // sheen once the pointer is gone, even mid-press.
                        setIsHovering(false);
                        setIsCracking(false);
                        setSheenPos("50% 50%");
                        const video = hoverVideoRef.current;
                        if (video) {
                            video.pause();
                            video.currentTime = 0;
                        }
                    }
                    onMouseLeave?.(event);
                }}
                onMouseDown={(event) => {
                    if (isPrimary && !isDisabled) {
                        // A fresh, differently-shaped fracture every click.
                        setCrackPaths(generateCrackPaths());
                        setIsCracking(true);
                    }
                    onMouseDown?.(event);
                }}
                onMouseUp={(event) => {
                    if (isPrimary) {
                        // The crack holds for as long as the button is actually pressed —
                        // it only starts healing once the mouse is released.
                        setIsCracking(false);
                    }
                    onMouseUp?.(event);
                }}
                {...props}
            >
                {isPrimary && (
                    <>
                        <span className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
                            <img
                                src="/images/dry.jfif"
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            {/* Wet state — the real video, played once per hover rather than
                                looped, so it reads as "the clay getting wet" instead of a
                                repeating loop. Holds its last frame once it finishes. */}
                            <video
                                ref={hoverVideoRef}
                                src="/video/button-state/hover-state.webm"
                                muted
                                playsInline
                                preload="auto"
                                aria-hidden="true"
                                className={cn(
                                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
                                    isHovering || isCracking ? "opacity-100" : "opacity-100"
                                )}
                            />
                            {/* Wet specular sheen — follows the cursor, only while hovering. */}
                            <span
                                className={cn(
                                    "absolute inset-0 mix-blend-soft-light transition-opacity duration-200",
                                    isHovering && !isCracking ? "opacity-90" : "opacity-0"
                                )}
                                style={{
                                    background: `radial-gradient(120px circle at ${sheenPos}, rgba(255,252,240,0.85), transparent 60%)`,
                                }}
                            />
                            {/* Constant dark scrim so text stays legible over any layer. */}
                            <span className="absolute inset-0 bg-[rgba(42,38,35,0.32)]" />
                        </span>

                        {/* Crack overlay — positioned (not negative z), so it paints above
                            the plain-text children automatically and visibly fractures
                            across both the material and the label. A shared turbulence
                            filter roughens the drawn lines into something closer to a real
                            jagged break instead of clean vector strokes. */}
                        <svg
                            className="pointer-events-none absolute inset-0 h-full w-full"
                            viewBox="0 0 200 60"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                            style={{ filter: "drop-shadow(0 1px 1.5px rgba(20,16,12,0.45))" }}
                        >
                            <defs>
                                <filter id={crackFilterId} x="-20%" y="-20%" width="140%" height="140%">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
                                </filter>
                            </defs>
                            <g filter={`url(#${crackFilterId})`}>
                                {crackPaths.map(({ d, width }, i) => (
                                    <g key={i}>
                                        {/* highlight edge — light catching the broken rim */}
                                        <path
                                            d={d}
                                            fill="none"
                                            stroke="#FFF6E8"
                                            strokeWidth={width * 0.7}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            pathLength={1}
                                            transform="translate(0.5,0.6)"
                                            style={{
                                                strokeDasharray: 1,
                                                strokeDashoffset: isCracking ? 0 : 1,
                                                opacity: isCracking ? 0.5 : 0,
                                                transition: `stroke-dashoffset 240ms ease-out ${i * 20}ms, opacity 180ms ease-out ${i * 20}ms`,
                                                mixBlendMode: "screen",
                                            }}
                                        />
                                        {/* the fracture itself */}
                                        <path
                                            d={d}
                                            fill="none"
                                            stroke="#1C1713"
                                            strokeWidth={width}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            pathLength={1}
                                            style={{
                                                strokeDasharray: 1,
                                                strokeDashoffset: isCracking ? 0 : 1,
                                                opacity: isCracking ? 0.92 : 0,
                                                transition: `stroke-dashoffset 240ms ease-out ${i * 20}ms, opacity 180ms ease-out ${i * 20}ms`,
                                                mixBlendMode: "multiply",
                                            }}
                                        />
                                    </g>
                                ))}
                            </g>
                        </svg>
                    </>
                )}
                {loading ? (
                    <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path
                                d="M22 12a10 10 0 0 1-10 10"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="opacity-75"
                            />
                        </svg>
                        {children}
                    </span>
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
