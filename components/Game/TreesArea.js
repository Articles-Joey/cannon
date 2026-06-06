import React, { useMemo } from "react";
import { useStore } from "@/hooks/useStore";
import Tree from "@/components/Models/Tree";

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
  inner = 80,
  outer = 200,
  count = 400,
  yOffset = 0,
  jitterScale = 0.4,
  ...props
}) {
  const graphicsQuality = useStore((s) => s.graphicsQuality);

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

  return (
    <group {...props}>
      {trees.map((t, i) => (
        <Tree
          key={i}
          position={t.position}
          rotation={t.rotation}
          scale={t.scale}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
