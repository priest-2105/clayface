"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createNoise2D } from "simplex-noise";

interface ClaySlabsProps {
    className?: string;
}

const SLAB_COUNT = 3;
const SLAB_GAP = 0.62;
const SLAB_THICKNESS = 0.16;
const ARC_SEGMENTS = 40;
const PARTICLE_COUNT = 30;

/**
 * Museum-specimen composition: irregular organic clay slabs floating with
 * visible gaps, surrounded by static dust particles. Nothing auto-animates —
 * the scene is a static exhibit until the viewer drags to orbit around it or
 * scrolls to zoom, clamped to a small distance range so it can't be zoomed
 * out to nothing or pushed inside the slabs.
 */
export function ClaySlabs({ className }: ClaySlabsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const noise2D = createNoise2D();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 30);
        camera.position.set(0, 1.35, 5.1);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        // ── Generated studio environment for real IBL — without this, MeshStandardMaterial
        // has no specular reflection at all and reads as flat/chalky no matter how good the
        // texture is. A neutral room env gives the rock subtle, physically real sheen.
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envRenderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = envRenderTarget.texture;

        const group = new THREE.Group();
        scene.add(group);

        // ── Irregular organic slabs, thin extrusions with rounded edges ──
        function slabShape(seed: number, radius: number): THREE.Shape {
            const shape = new THREE.Shape();
            for (let s = 0; s <= ARC_SEGMENTS; s++) {
                const a = (Math.PI * 2 * s) / ARC_SEGMENTS;
                const wobble =
                    1 +
                    noise2D(Math.cos(a) * 1.4 + seed, Math.sin(a) * 1.4 + seed) * 0.22 +
                    noise2D(Math.cos(a) * 3.1 + seed + 9, Math.sin(a) * 3.1 + seed + 9) * 0.08;
                const r = radius * wobble;
                const x = Math.cos(a) * r;
                const y = Math.sin(a) * r;
                if (s === 0) shape.moveTo(x, y);
                else shape.lineTo(x, y);
            }
            return shape;
        }

        const slabMeshes: THREE.Mesh[] = [];

        const slabMaterial = new THREE.MeshStandardMaterial({
            color: "#DCCEB4",
            roughness: 0.92,
            metalness: 0,
            envMapIntensity: 0.55,
        });

        // ── Worn-rock PBR texture set, applied once loaded ──
        const textureLoader = new THREE.TextureLoader();
        const exrLoader = new EXRLoader();
        const loadedRockTextures: THREE.Texture[] = [];

        function tileable(texture: THREE.Texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2.4, 2.4);
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            loadedRockTextures.push(texture);
            return texture;
        }

        textureLoader.load("/textures/rock/diffuse.jpg", (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            slabMaterial.map = tileable(tex);
            slabMaterial.needsUpdate = true;
        });
        textureLoader.load("/textures/rock/displacement.png", (tex) => {
            slabMaterial.bumpMap = tileable(tex);
            slabMaterial.bumpScale = 0.07;
            slabMaterial.needsUpdate = true;
        });
        exrLoader.load("/textures/rock/normal.exr", (tex) => {
            slabMaterial.normalMap = tileable(tex);
            slabMaterial.normalScale = new THREE.Vector2(1.1, 1.1);
            slabMaterial.needsUpdate = true;
        });
        exrLoader.load("/textures/rock/roughness.exr", (tex) => {
            slabMaterial.roughnessMap = tileable(tex);
            slabMaterial.needsUpdate = true;
        });

        for (let i = 0; i < SLAB_COUNT; i++) {
            const radius = 1.0 + noise2D(i * 3.3, 4) * 0.17;
            const shape = slabShape(i * 5.1, radius);

            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: SLAB_THICKNESS,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.035,
                bevelSegments: 4,
                curveSegments: 1,
            });
            geometry.rotateX(-Math.PI / 2);
            geometry.translate(0, -SLAB_THICKNESS / 2, 0);

            const mesh = new THREE.Mesh(geometry, slabMaterial);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const y = (i - (SLAB_COUNT - 1) / 2) * SLAB_GAP;
            const offsetX = noise2D(i * 2.2, 11) * 0.18;
            const offsetZ = noise2D(i * 2.2, 22) * 0.18;
            const rotY = noise2D(i * 2.2, 33) * Math.PI * 0.4;

            mesh.position.set(offsetX, y, offsetZ);
            mesh.rotation.y = rotY;

            slabMeshes.push(mesh);
            group.add(mesh);
        }

        // ── Static dust particles ──
        const particleGeometry = new THREE.SphereGeometry(0.009, 6, 6);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: "#EFE6D4",
            roughness: 0.6,
            metalness: 0,
        });
        const particles = new THREE.InstancedMesh(particleGeometry, particleMaterial, PARTICLE_COUNT);
        const dummy = new THREE.Object3D();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const x = (noise2D(i * 1.7, 50) - 0.5) * 2.2;
            const z = (noise2D(i * 1.7, 60) - 0.5) * 2.2;
            const y0 = (noise2D(i * 1.7, 70) - 0.5) * (SLAB_GAP * SLAB_COUNT);
            dummy.position.set(x, y0, z);
            dummy.updateMatrix();
            particles.setMatrixAt(i, dummy.matrix);
        }
        group.add(particles);

        // ── Studio lighting — one dominant key for real directional modeling of the
        // rock's surface detail, a low fill so shadows don't go fully black, and a
        // faint warm rim to separate the stack from the background. Flat, even
        // lighting was the other big reason this read as fake — real material needs
        // contrast to show its texture. ──
        const key = new THREE.DirectionalLight(0xfff3e2, 3.2);
        key.position.set(2.4, 3.4, 2.4);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.camera.left = -2;
        key.shadow.camera.right = 2;
        key.shadow.camera.top = 2;
        key.shadow.camera.bottom = -2;
        key.shadow.bias = -0.0015;
        key.shadow.radius = 3;
        scene.add(key);

        const fill = new THREE.DirectionalLight(0xeef1f6, 0.35);
        fill.position.set(-2.6, 1.1, -1.2);
        scene.add(fill);

        const rim = new THREE.DirectionalLight(0xffd9ad, 0.5);
        rim.position.set(-1.2, 1.6, -2.8);
        scene.add(rim);

        const hemi = new THREE.HemisphereLight(0xf6f3ee, 0x3a2f24, 0.28);
        scene.add(hemi);

        // ── Soft contact shadow catcher beneath the stack ──
        const shadowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 4),
            new THREE.ShadowMaterial({ opacity: 0.16 })
        );
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -(SLAB_GAP * (SLAB_COUNT - 1)) / 2 - 0.24;
        shadowPlane.receiveShadow = true;
        group.add(shadowPlane);

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

        // ── Drag to orbit, scroll to zoom — clamped to a small distance range ──
        const startDistance = camera.position.length();
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.minDistance = startDistance * 0.82;
        controls.maxDistance = startDistance * 1.2;
        controls.minPolarAngle = Math.PI * 0.18;
        controls.maxPolarAngle = Math.PI * 0.62;
        controls.update();

        let frameId = 0;
        let visible = !document.hidden;
        const handleVisibility = () => {
            visible = !document.hidden;
        };
        document.addEventListener("visibilitychange", handleVisibility);

        function tick() {
            frameId = requestAnimationFrame(tick);
            if (!visible) return;

            controls.update();
            renderer.render(scene, camera);
        }
        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
            document.removeEventListener("visibilitychange", handleVisibility);
            controls.dispose();
            resizeObserver.disconnect();
            slabMeshes.forEach((mesh) => mesh.geometry.dispose());
            slabMaterial.dispose();
            loadedRockTextures.forEach((tex) => tex.dispose());
            particleGeometry.dispose();
            particleMaterial.dispose();
            shadowPlane.geometry.dispose();
            (shadowPlane.material as THREE.Material).dispose();
            envRenderTarget.dispose();
            pmremGenerator.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} className={className} aria-hidden="true" />;
}
