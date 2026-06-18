import React, { useMemo, useRef } from "react";
import { useStore } from "@/hooks/useStore";
import Tree from "@/components/Models/Tree";
import { Image, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import imageTree from "@/public/img/toontown/tree_big.webp";

/**
 * TreesArea
 * - Places `count` Tree components randomly inside a square area with an inner cutout.
 * - Reduces the number of trees when `graphicsQuality` is 'Medium' or 'Low'.
 *
 * Props:
 * - inner: inner cutout half-size (square radius)
 * - outer: outer half-size (square radius)
 * - count: initial desired tree count
 * - yOffset: vertical offset applied to all trees
 * - jitterScale: max random variation applied to tree scale (multiplied)
 * - seed: optional number to seed randomness (currently ignored)
 */
export default function TreesArea({
  inner = 100,
  outer = 200,
  count = 400,
  yOffset = 0,
  jitterScale = 0.4,
  ...props
}) {
  const graphicsQuality = useStore((s) => s.graphicsQuality);
  const toontownMode = useStore((s) => s.toontownMode);

  const treeCount = useMemo(() => {
    if (graphicsQuality === "Low") return Math.max(0, Math.floor(count / 3));
    if (graphicsQuality === "Medium") return Math.max(0, Math.floor(count / 2));
    return count;
  }, [count, graphicsQuality]);

  const trees = useMemo(() => {
    const out = [];
    for (let i = 0; i < treeCount; i++) {
      let x, z;
      // sample uniformly in square until outside inner square
      do {
        x = (Math.random() * 2 - 1) * outer;
        z = (Math.random() * 2 - 1) * outer;
      } while (Math.abs(x) < inner && Math.abs(z) < inner);

      const rot = Math.random() * Math.PI * 2;
      const baseScale = 0.8 + Math.random() * 0.8; // base size
      const scale = baseScale * (1 - Math.random() * jitterScale);

      out.push({ position: [x, yOffset, z], rotation: [0, rot, 0], scale: [scale, scale, scale] });
    }
    return out;
  }, [treeCount, inner, outer, yOffset, jitterScale]);
  // compute image world size to preserve aspect ratio and avoid cropping
  const imgAspect = (imageTree.naturalWidth && imageTree.naturalHeight) ? imageTree.naturalWidth / imageTree.naturalHeight : 0.5;
  const imgWorldHeight = 2; // world units for tree image height
  const imgWorldWidth = imgWorldHeight * imgAspect;

  // multiplier to scale trees/billboards in world units (use 10x as requested)
  const WORLD_SCALE = 10;

  // Y-axis-only billboard: uses lookAt each frame to face the camera without X/Z tilt
  function Billboard({ position, scale, width, height, url }) {

    const darkMode = useStore(state => state.darkMode);

    const ref = useRef();
    const { camera } = useThree();
    const texture = useTexture(url);

    useFrame(() => {
      if (!ref.current) return;
      // make a target at the camera's x/z but keep billboard's y to avoid pitch
      const target = camera.position.clone();
      target.y = ref.current.position.y;
      ref.current.lookAt(target);
    });

    return (
      <group ref={ref} position={position} scale={scale}>
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial 
            map={texture} 
            transparent={true} 
            alphaTest={0.5} 
            color={darkMode ? "#5f5f5f" : "white"}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group {...props}>
      {trees.map((t, i) => {

        const scaled = t.scale.map((s) => s * WORLD_SCALE);

        if (toontownMode) {
          return (
            <Billboard
              key={i}
              position={[
                t.position[0],
                t.position[1] + scaled[1] / 2,
                t.position[2],
              ]}
              scale={scaled}
              width={imgWorldWidth}
              height={imgWorldHeight}
              url={imageTree.src}
            />
          )
        } else {
          return (
            <Tree
              key={i}
              position={t.position}
              rotation={t.rotation}
              // apply world-scale multiplier so models appear 10x bigger
              scale={1}
              castShadow
              receiveShadow
            />
          )
        }

      })}
    </group>
  );
}
