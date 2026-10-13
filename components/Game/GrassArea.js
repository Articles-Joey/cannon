import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, DoubleSide, Object3D, ShaderMaterial } from "three";
import { useStore } from "@/hooks/useStore";

const vertexShader = /* glsl */`
    varying vec2 vUv;
    uniform float time;

    void main() {
        vUv = uv;
        vec4 worldPos = instanceMatrix * vec4(position, 1.0);

        // Sway increases toward tip (vUv.y = 0 at base, 1 at tip)
        float swayAmount = vUv.y * vUv.y;
        float phaseOffset = worldPos.x * 0.7 + worldPos.z * 0.5;

        worldPos.x += sin(time * 1.5 + phaseOffset) * swayAmount * 0.25;
        worldPos.z += cos(time * 1.1 + phaseOffset) * swayAmount * 0.12;

        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

const fragmentShader = /* glsl */`
    varying vec2 vUv;
    uniform float brightness;

    void main() {
        vec3 baseColor = vec3(0.08, 0.35, 0.08);
        vec3 tipColor  = vec3(0.38, 0.68, 0.18);
        vec3 color = mix(baseColor, tipColor, vUv.y);
        gl_FragColor = vec4(color * brightness, 1.0);
    }
`;

const DEFAULT_EXCLUSION_RINGS = [{ inner: 40, outer: 47 }];

function createBladeGeometry() {
    const geometry = new BufferGeometry();
    const w = 0.05;
    const h = 0.8;

    // 5 verts: base-left, base-right, mid-left, mid-right, tip
    const positions = new Float32Array([
        -w,         0,       0,
         w,         0,       0,
        -w * 0.5,   h * 0.5, 0,
         w * 0.5,   h * 0.5, 0,
         0,         h,       0,
    ]);

    const uvs = new Float32Array([
        0,   0,
        1,   0,
        0,   0.5,
        1,   0.5,
        0.5, 1,
    ]);

    const indices = [0, 1, 2,  1, 3, 2,  2, 3, 4];

    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
}

function isInsideAnyRing(x, z, rings = []) {
    const distanceSq = x * x + z * z;
    return rings.some(({ inner = 0, outer = 0 }) => {
        const safeInner = Math.max(0, inner);
        const safeOuter = Math.max(safeInner, outer);
        return distanceSq >= safeInner * safeInner && distanceSq <= safeOuter * safeOuter;
    });
}

export default function GrassArea({
    inner = 1,
    outer = 100,
    count = (16000 * 4),
    exclusionRings = DEFAULT_EXCLUSION_RINGS,
    // isCircle = false,
    isCircle = true,
}) {

    const graphicsQuality = useStore(state => state.graphicsQuality);    
    const darkMode = useStore(state => state.darkMode);

    const bladeCount = useMemo(() => {
        if (graphicsQuality === 'Low')    return Math.floor(count * 0.15);
        if (graphicsQuality === 'Medium') return Math.floor(count * 0.5);
        return count;
    }, [count, graphicsQuality]);

    const geometry = useMemo(() => createBladeGeometry(), []);

    const material = useMemo(() => new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            time: { value: 0 },
            brightness: { value: 1 },
        },
        side: DoubleSide,
    }), []);

    useEffect(() => {
        material.uniforms.brightness.value = darkMode ? 0.3 : 1;
    }, [darkMode, material]);

    const meshRef = useRef();

    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh) return;
        const dummy = new Object3D();
        const minRadius = Math.max(0, inner);
        const maxRadius = Math.max(minRadius, outer);

        for (let i = 0; i < bladeCount; i++) {
            // Random position in either a square field or circular annulus,
            // while excluding circular ring cutouts.
            let x, z;
            let attempts = 0;

            do {
                if (isCircle) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.sqrt(
                        Math.random() * (maxRadius * maxRadius - minRadius * minRadius) +
                        minRadius * minRadius
                    );
                    x = Math.cos(angle) * radius;
                    z = Math.sin(angle) * radius;
                } else {
                    x = (Math.random() * 2 - 1) * outer;
                    z = (Math.random() * 2 - 1) * outer;
                }
                attempts += 1;
            } while (
                attempts < 40 &&
                (
                    (!isCircle && (Math.abs(x) < inner && Math.abs(z) < inner)) ||
                    isInsideAnyRing(x, z, exclusionRings)
                )
            );

            dummy.position.set(x, 0, z);
            dummy.rotation.y = Math.random() * Math.PI * 2;
            dummy.scale.setScalar(0.7 + Math.random() * 0.8);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
    }, [bladeCount, inner, outer, exclusionRings, isCircle]);

    useFrame(({ clock }) => {

        if (graphicsQuality === 'Low') return

        material.uniforms.time.value = clock.getElapsedTime();

    });

    if (graphicsQuality === 'Low') return

    return (
        <instancedMesh ref={meshRef} args={[geometry, material, bladeCount]} frustumCulled={false} />
    );
}
