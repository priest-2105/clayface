"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

interface ClayStrataProps {
    className?: string;
}

const LAYER_COUNT = 30;
const LAYER_THICKNESS = 0.085;
const BASE_RADIUS = 1.55;
const WEDGE_ANGLE = (58 * Math.PI) / 180; // how much of the disc is cut away
const ARC_SEGMENTS = 56;

// Warm porcelain → raw clay → leather clay band, echoing the brand palette,
// bottom (older/deeper) strata reading darker like sedimentary rock.
const STRATA_COLORS = ["#EFE7D8", "#E3D7C0", "#D4C1A3", "#C2AD8B", "#AC9372"];

function layerColor(t: number): THREE.Color {
    const scaled = t * (STRATA_COLORS.length - 1);
    const i = Math.min(Math.floor(scaled), STRATA_COLORS.length - 2);
    const localT = scaled - i;
    return new THREE.Color(STRATA_COLORS[i]).lerp(new THREE.Color(STRATA_COLORS[i + 1]), localT);
}

/**
 * A large topographic sculpture: dozens of stacked, wedge-cut clay layers
 * whose contours flow and drift from one to the next, revealing a strata
 * cross-section where the wedge is missing. A slow turntable rotation
 * alternates between the sculpted exterior and the cutaway interior.
 */
export function ClayStrata({ className }: ClayStrataProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
        camera.position.set(3.6, 2.4, 4.4);
        camera.lookAt(0, LAYER_COUNT * LAYER_THICKNESS * 0.42, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const noise2D = createNoise2D();
        const cutStart = -WEDGE_ANGLE / 2;
        const arcLength = Math.PI * 2 - WEDGE_ANGLE;

        // Overall silhouette envelope — a soft dome, narrower at the base, so the
        // stack reads as a sculpted mound rather than a plain cylinder.
        function envelope(t: number): number {
            return BASE_RADIUS * (0.5 + 0.5 * Math.sin(Math.PI * Math.pow(t, 0.75)));
        }

        for (let i = 0; i < LAYER_COUNT; i++) {
            const t = i / (LAYER_COUNT - 1);
            const envRadius = envelope(t);

            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            for (let s = 0; s <= ARC_SEGMENTS; s++) {
                const a = cutStart + (arcLength * s) / ARC_SEGMENTS;
                const wobble = 1 + noise2D(Math.cos(a) * 1.6 + t * 5, Math.sin(a) * 1.6 + t * 5) * 0.1;
                const r = envRadius * wobble;
                const x = Math.cos(a) * r;
                const y = Math.sin(a) * r;
                if (s === 0) shape.lineTo(x, y);
                else shape.lineTo(x, y);
            }
            shape.lineTo(0, 0);

            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: LAYER_THICKNESS,
                bevelEnabled: true,
                bevelThickness: 0.008,
                bevelSize: 0.012,
                bevelSegments: 1,
                curveSegments: 1,
            });
            geometry.rotateX(-Math.PI / 2);

            const material = new THREE.MeshStandardMaterial({
                color: layerColor(t),
                roughness: 0.96,
                metalness: 0,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const jitter = 0.012;
            mesh.position.set(
                (noise2D(t * 9, 1) - 0.5) * jitter,
                i * LAYER_THICKNESS,
                (noise2D(t * 9, 2) - 0.5) * jitter
            );

            group.add(mesh);
        }

        // Center the stack roughly on the scene origin and settle it into the camera framing.
        group.position.set(0, -(LAYER_COUNT * LAYER_THICKNESS) / 2, 0);

        // ── Soft studio lighting ──
        const key = new THREE.DirectionalLight(0xfff3e0, 2.4);
        key.position.set(4, 5, 3);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.left = -3;
        key.shadow.camera.right = 3;
        key.shadow.camera.top = 3;
        key.shadow.camera.bottom = -3;
        scene.add(key);

        const fill = new THREE.DirectionalLight(0xf6f3ee, 0.7);
        fill.position.set(-4, 1.5, -2);
        scene.add(fill);

        const hemi = new THREE.HemisphereLight(0xf6f3ee, 0x3a2f24, 0.55);
        scene.add(hemi);

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

        const ROTATION_PERIOD_MS = 42000;

        function tick(t: number) {
            frameId = requestAnimationFrame(tick);
            if (!visible) return;

            if (!prefersReducedMotion) {
                group.rotation.y = (t / ROTATION_PERIOD_MS) * Math.PI * 2;
            } else {
                group.rotation.y = 0.6;
            }
            renderer.render(scene, camera);
        }
        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
            document.removeEventListener("visibilitychange", handleVisibility);
            resizeObserver.disconnect();
            group.children.forEach((child) => {
                const mesh = child as THREE.Mesh;
                mesh.geometry.dispose();
                (mesh.material as THREE.Material).dispose();
            });
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} className={className} aria-hidden="true" />;
}
