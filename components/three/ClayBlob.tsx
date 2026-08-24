"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise2D, createNoise4D } from "simplex-noise";

/** Procedural grayscale grain texture — stands in for a scanned clay-surface bump map. */
function createGrainTexture(): THREE.DataTexture {
    const size = 128;
    const noise2D = createNoise2D();
    const data = new Uint8Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const nx = x / size;
            const ny = y / size;
            const n =
                noise2D(nx * 6, ny * 6) * 0.6 +
                noise2D(nx * 18, ny * 18) * 0.3 +
                noise2D(nx * 40, ny * 40) * 0.1;
            data[y * size + x] = Math.floor(((n + 1) / 2) * 255);
        }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    texture.needsUpdate = true;
    return texture;
}

                                                                                        
interface ClayBlobProps {
    className?: string;
    /** Base material color, e.g. the raw-clay or fired-bronze token as a hex string. */
    color?: string;
    accentColor?: string;
}                                                                                       

/**
 * A living clay blob rendered with three.js: a high-resolution sphere whose
 * vertices are continuously displaced along their normals with 4D simplex
 * noise, so it reads as hand-pressed material breathing in place rather than
 * a spinning stock-photo sphere.
 */
export function ClayBlob({ className, color = "#C9AF8C", accentColor = "#75604A" }: ClayBlobProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);
        camera.position.set(0, 0, 5.4);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // ── Geometry: sphere dense enough for smooth organic displacement ──
        const geometry = new THREE.SphereGeometry(1.55, 128, 128);
        const basePositions = geometry.attributes.position.array.slice();

        const grainTexture = createGrainTexture();

        const material = new THREE.MeshPhysicalMaterial({
            color,
            roughness: 0.97,
            metalness: 0,
            clearcoat: 0.04,
            clearcoatRoughness: 0.8,
            bumpMap: grainTexture,
            bumpScale: 0.012,
            flatShading: false,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // ── Warm studio lighting matched to the porcelain/bronze palette ──
        const key = new THREE.DirectionalLight(0xfff3e0, 2.2);
        key.position.set(3, 4, 5);
        scene.add(key);

        const rim = new THREE.DirectionalLight(accentColor, 1.1);
        rim.position.set(-4, -2, -3);
        scene.add(rim);

        const hemi = new THREE.HemisphereLight(0xf6f3ee, 0x2a2623, 0.65);
        scene.add(hemi);

        // ── Noise-driven "living material" deformation ──
        // Layered (fbm) noise: one slow, large-radius pass reads as the hand-pressed
        // overall form; a second faster, smaller pass reads as fingertip-scale texture.
        // A single-octave sphere just looks like an inflated balloon — clay needs both scales.
        const noise4D = createNoise4D();

        function deform(time: number) {
            const pos = geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const ix = i * 3;

                const bx = basePositions[ix];
                const by = basePositions[ix + 1];
                const bz = basePositions[ix + 2];

                const large = noise4D(bx * 0.7, by * 0.7, bz * 0.7, time);
                const small = noise4D(bx * 2.6 + 40, by * 2.6 + 40, bz * 2.6 + 40, time * 1.6);

                const displacement = 1 + large * 0.17 + small * 0.045;

                pos.setXYZ(i, bx * displacement, by * displacement, bz * displacement);
            }
            pos.needsUpdate = true;
            geometry.computeVertexNormals();
        }

        function resize() {
            if (!container) return;
            const { clientWidth, clientHeight } = container;
            if (clientWidth === 0 || clientHeight === 0) return;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        resize();

        let frameId = 0;
        let visible = !document.hidden;
        const handleVisibility = () => {
            visible = !document.hidden;
        };
        document.addEventListener("visibilitychange", handleVisibility);

        function tick(t: number) {
            frameId = requestAnimationFrame(tick);
            if (!visible) return;

            if (!prefersReducedMotion) {
                deform(t * 0.00012);
                mesh.rotation.y = t * 0.00008;
                mesh.rotation.x = Math.sin(t * 0.00006) * 0.12;
            }
            renderer.render(scene, camera);
        }

        if (prefersReducedMotion) {
            deform(0);
        }
        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
            document.removeEventListener("visibilitychange", handleVisibility);
            resizeObserver.disconnect();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, [color, accentColor]);

    return <div ref={containerRef} className={className} aria-hidden="true" />;
}
