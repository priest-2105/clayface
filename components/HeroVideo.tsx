"use client";

import { useEffect, useRef } from "react";

interface HeroVideoProps {
    src: string;
    className?: string;
}

/**
 * Background video: plays through once on load, then holds on its last
 * frame. No loop, no scroll interaction.
 */
export function HeroVideo({ src, className }: HeroVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.play().catch(() => {
            // Autoplay can be rejected until a user gesture on some browsers;
            // it'll just sit on the first frame until then.
        });
    }, []);

    return (
        <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            className={className}
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
    );
}
