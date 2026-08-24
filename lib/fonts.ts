import { Geist, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";

/**
 * Geist — the interface font. Everything users interact with:
 * navigation, buttons, cards, settings, projects.
 */
export const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
    display: "swap",
});

/**
 * Instrument Serif — the display font. Hero headlines and
 * marketing/editorial moments only. Never inside forms or dashboard UI.
 */
export const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-instrument-serif",
    display: "swap",
});

/**
 * IBM Plex Mono — the technical/compiler font: code, IDs,
 * timestamps, generated metadata.
 */
export const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-plex-mono",
    display: "swap",
});
