import { Inter, IBM_Plex_Mono } from "next/font/google";

/**
 * Inter Variable — Linear's exact font.
 * The cv01 + ss03 OpenType features are applied globally in globals.css
 * via font-feature-settings. This transforms Inter from a generic sans-serif
 * into Linear's engineered, precise-looking typeface.
 */
export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    // Weight 510 (Linear's signature) is set per-element via
    // font-variation-settings: 'wght' 510 in globals.css
});

/**
 * IBM Plex Mono — code blocks and monospaced content.
 * Linear uses Berkeley Mono (paid), Plex Mono is the closest free equivalent.
 */
export const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-plex-mono",
    display: "swap",
});
