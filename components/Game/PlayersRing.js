import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

/**
 * PlayersRing
 * - Renders a flat ring (disc with an inner cutout) using `ringGeometry`.
 * - Supports an albedo texture (`textureUrl`) and a normal map (`normalUrl`).
 *
 * Props:
 * - innerRadius: inner cutout radius
 * - outerRadius: outer radius
 * - segments: radial segments
 * - textureUrl: URL or import for color map
 * - normalUrl: URL or import for normal map
 * - textureRepeat: [u, v] repeat for the maps
 * - normalScale: normal map scale
 * - position, rotation: mesh transform (rotation default lays ring flat on XZ)
 */
export default function PlayersRing({
  innerRadius = 40,
  outerRadius = 47,
  segments = 128,
  textureUrl = "textures/Sand/GroundSand005_COL_1K.jpg",
  normalUrl = "textures/Sand/GroundSand005_NRM_1K.jpg",
  textureRepeat = [1, 1],
  normalScale = [1, 1],
  // wall texture (brick) placed vertical on inner/outer edges
  wallTextureUrl = "textures/Brick/Poliigon_BrickReclaimedRunning_7787_Base.jpg",
  wallNormalUrl = null,
  wallTextureRepeat = null, // explicit repeat (u,v); if null compute from `wallTileSize`
  wallTileSize = [500, 1], // world units per tile [width (around), height (vertical)]
  wallHeight = 0.15,
  wallThickness = 0.4,
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0], // applies only to the flat ring
  metalness = 0.1,
  roughness = 0.8,
  color = 0xffffff,
  side = THREE.DoubleSide,
  ...props
}) {
  const colorMap = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;
  const normalMap = normalUrl ? useLoader(THREE.TextureLoader, normalUrl) : null;
  const wallMap = wallTextureUrl ? useLoader(THREE.TextureLoader, wallTextureUrl) : null;
  const wallNormal = wallNormalUrl ? useLoader(THREE.TextureLoader, wallNormalUrl) : null;

  useMemo(() => {
    if (colorMap) {
      colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
      colorMap.repeat.set(textureRepeat[0], textureRepeat[1]);
      colorMap.encoding = THREE.sRGBEncoding;
    }
    if (normalMap) {
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
      normalMap.repeat.set(textureRepeat[0], textureRepeat[1]);
    }
  }, [colorMap, normalMap, textureRepeat]);

  // prepare wall texture mapping around circumference
  useMemo(() => {
    if (!wallMap) return;
    wallMap.wrapS = wallMap.wrapT = THREE.RepeatWrapping;
    // circumference-based U repeat so the bricks tile around the ring naturally
    const circumOuter = 2 * Math.PI * outerRadius;
    const circumInner = 2 * Math.PI * innerRadius || 1;
    let repeatU, repeatV;
    if (wallTextureRepeat) {
      repeatU = wallTextureRepeat[0];
      repeatV = wallTextureRepeat[1] ?? 1;
    } else {
      repeatU = Math.max(1, Math.round(circumOuter / Math.max(0.0001, wallTileSize[0])));
      repeatV = Math.max(1, Math.round(wallHeight / Math.max(0.0001, wallTileSize[1])));
    }
    wallMap.repeat.set(repeatU, repeatV);
    wallMap.encoding = THREE.sRGBEncoding;
    if (wallNormal) {
      wallNormal.wrapS = wallNormal.wrapT = THREE.RepeatWrapping;
      wallNormal.repeat.set(repeatU, repeatV);
    }
  }, [wallMap, wallNormal, outerRadius, innerRadius, wallTextureRepeat, wallHeight]);

  // normalScale expects a Vector2 in three; convert on the fly in material props
  const normalScaleVec = useMemo(() => new THREE.Vector2(normalScale[0], normalScale[1]), [normalScale]);

  // Render ring flat (apply rotation to ring mesh only) and vertical walls as cylinders
  // Create extruded ring sections for real thickness
  const outerWallInner = Math.max(0.001, outerRadius - wallThickness);
  const innerWallOuter = innerRadius + wallThickness;

  const outerWallGeom = useMemo(() => {
    if (!wallMap) return null;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, outerWallInner, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: wallHeight,
      bevelEnabled: false,
      steps: 1,
      curveSegments: Math.max(8, segments),
    });
    // ExtrudeGeometry depth goes +Z; rotate so depth becomes +Y (up)
    geom.rotateX(Math.PI / 2);
    geom.translate(0, 0, 0);
    return geom;
  }, [wallMap, outerRadius, outerWallInner, wallHeight, segments]);

  const innerWallGeom = useMemo(() => {
    if (!wallMap || innerRadius <= 0) return null;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, innerWallOuter, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: wallHeight,
      bevelEnabled: false,
      steps: 1,
      curveSegments: Math.max(8, segments),
    });
    geom.rotateX(Math.PI / 2);
    geom.translate(0, 0, 0);
    return geom;
  }, [wallMap, innerRadius, innerWallOuter, wallHeight, segments]);

  return (
    <group position={position} {...props}>
      {/* flat ring surface */}
      <mesh rotation={rotation}>
        <ringGeometry args={[innerRadius, outerRadius, segments]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          map={colorMap || undefined}
          normalMap={normalMap || undefined}
          normalScale={normalScaleVec}
          side={side}
        />
      </mesh>

      {/* outer wall (extruded) */}
      {outerWallGeom && (
        <mesh geometry={outerWallGeom} position={[0, wallHeight, 0]}>
          <meshStandardMaterial map={wallMap} normalMap={wallNormal || undefined} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* inner wall (extruded) */}
      {innerWallGeom && (
        <mesh geometry={innerWallGeom} position={[0, wallHeight, 0]}>
          <meshStandardMaterial map={wallMap} normalMap={wallNormal || undefined} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// Usage example:
// <PlayersRing innerRadius={2} outerRadius={4} textureUrl="/textures/metal.jpg" normalUrl="/textures/metal_n.jpg" />
