"use client"

import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Cylinder, useTexture } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute, Quaternion, SRGBColorSpace, Vector2, Vector3 } from 'three';
import WaterPlane from '../Game/WaterPlane';
import { WATER_TOWER_DIMENSIONS, getWaterTowerWaterRadius } from '@/util/waterTowerDimensions';

// A solid stave with wider top corners, an inside face, and exposed end grain.
function createPlankGeometry(topRadius, bottomRadius, height, thickness, count) {
    const halfAngle = Math.PI / count * 0.985;
    const corner = (radius, y, angle) => [
        Math.sin(angle) * radius, y, Math.cos(angle) * radius,
    ];
    const corners = [
        corner(bottomRadius, 0, -halfAngle),
        corner(bottomRadius, 0, halfAngle),
        corner(topRadius, height, halfAngle),
        corner(topRadius, height, -halfAngle),
        corner(bottomRadius - thickness, 0, -halfAngle),
        corner(bottomRadius - thickness, 0, halfAngle),
        corner(topRadius - thickness, height, halfAngle),
        corner(topRadius - thickness, height, -halfAngle),
    ];
    const faces = [
        [0, 1, 2, 3], // Outside
        [5, 4, 7, 6], // Inside
        [4, 0, 3, 7], // Left edge
        [1, 5, 6, 2], // Right edge
        [3, 2, 6, 7], // Open rim: only the plank ends cover the top
        [4, 5, 1, 0], // Bottom edge
    ];
    const positions = [];
    const uvs = [];
    const indices = [];
    faces.forEach((face, index) => {
        face.forEach(vertex => positions.push(...corners[vertex]));
        uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
        const start = index * 4;
        indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
}

function SupportBeam({ start, end, width, texture }) {
    const direction = new Vector3(...end).sub(new Vector3(...start));
    const length = direction.length();
    const quaternion = new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0), direction.normalize(),
    );
    return (
        <mesh
            position={start.map((value, axis) => (value + end[axis]) / 2)}
            quaternion={quaternion}
            castShadow receiveShadow
        >
            <boxGeometry args={[width, length, width]} />
            <meshStandardMaterial map={texture} color="#997044" roughness={0.9} />
        </mesh>
    );
}

// Local ground is y=0 and the highest plank ends are exactly y=height.
export function WaterTower({
    height = WATER_TOWER_DIMENSIONS.height,
    bucketHeight = WATER_TOWER_DIMENSIONS.bucketHeight,
    topRadius = WATER_TOWER_DIMENSIONS.topRadius,
    bottomRadius = WATER_TOWER_DIMENSIONS.bottomRadius,
    wallThickness = WATER_TOWER_DIMENSIONS.wallThickness,
    plankCount = WATER_TOWER_DIMENSIONS.plankCount,
    waterInset = WATER_TOWER_DIMENSIONS.waterInset,
    bandWidth = 0.35,
    bandThickness = 0.08,
    ...props
}) {
    const gl = useThree(state => state.gl);
    const sourceTexture = useTexture('/img/toontown/water-tower-side.webp');
    const woodTexture = useMemo(() => {
        const texture = sourceTexture.clone();
        // Crop one wood panel between the existing texture's painted metal bands.
        texture.repeat.set(1 / 8, 0.55);
        texture.offset.set(0.015, 0.23);
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        texture.needsUpdate = true;
        return texture;
    }, [sourceTexture, gl]);
    const plankGeometry = useMemo(() => createPlankGeometry(
        topRadius, bottomRadius, bucketHeight, wallThickness, plankCount,
    ), [topRadius, bottomRadius, bucketHeight, wallThickness, plankCount]);
    useEffect(() => () => woodTexture.dispose(), [woodTexture]);
    useEffect(() => () => plankGeometry.dispose(), [plankGeometry]);

    const bucketBottom = height - bucketHeight;
    const radiusAt = y => bottomRadius + (topRadius - bottomRadius) * y / bucketHeight;
    const fittedBandWidth = Math.min(bandWidth, bucketHeight / 4);
    const bandInset = fittedBandWidth * 0.75;
    const bandCenters = [
        bandInset + fittedBandWidth / 2,
        bucketHeight - bandInset - fittedBandWidth / 2,
    ];
    const footRadius = bottomRadius * 0.9;
    const shoulderRadius = bottomRadius * 0.72;
    const legWidth = 0.45;
    const supportSections = Array.from({ length: 3 }, (_, index) => {
        const lowerFraction = index / 3;
        const upperFraction = (index + 1) / 3;
        return {
            lowerY: bucketBottom * lowerFraction,
            upperY: bucketBottom * upperFraction,
            lowerRadius: footRadius + (shoulderRadius - footRadius) * lowerFraction,
            upperRadius: footRadius + (shoulderRadius - footRadius) * upperFraction,
        };
    });
    const waterRadius = getWaterTowerWaterRadius({
        topRadius, bottomRadius, bucketHeight, wallThickness, plankCount, waterInset,
    });
    const plankColors = ['#d6ae79', '#c69a64', '#dfb986', '#bc925e', '#ceaa78'];

    return (
        <group {...props}>
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map(angle => (
                <group key={angle} rotation={[0, angle, 0]}>
                    <SupportBeam
                        start={[-footRadius, 0, footRadius]}
                        end={[-shoulderRadius, bucketBottom, shoulderRadius]}
                        width={legWidth} texture={woodTexture}
                    />
                    {supportSections.map(({ lowerY, upperY, lowerRadius, upperRadius }, index) => (
                        <group key={index}>
                            <SupportBeam
                                start={[-lowerRadius, lowerY, lowerRadius]}
                                end={[upperRadius, upperY, upperRadius]}
                                width={0.23} texture={woodTexture}
                            />
                            <SupportBeam
                                start={[lowerRadius, lowerY, lowerRadius]}
                                end={[-upperRadius, upperY, upperRadius]}
                                width={0.23} texture={woodTexture}
                            />
                        </group>
                    ))}
                </group>
            ))}

            <Cylinder
                args={[bottomRadius + 0.22, bottomRadius + 0.22, 0.3, plankCount]}
                position={[0, bucketBottom - 0.15, 0]} castShadow receiveShadow
            >
                <meshStandardMaterial map={woodTexture} color="#87603d" roughness={0.9} />
            </Cylinder>

            <group position={[0, bucketBottom, 0]}>
                {Array.from({ length: plankCount }, (_, index) => (
                    <mesh
                        key={index} geometry={plankGeometry}
                        rotation={[0, index * Math.PI * 2 / plankCount, 0]}
                        castShadow receiveShadow
                    >
                        <meshStandardMaterial
                            map={woodTexture} color={plankColors[index % plankColors.length]}
                            roughness={0.85}
                        />
                    </mesh>
                ))}

                {/* Only the floor is capped; the top stays open for the water. */}
                <Cylinder
                    args={[bottomRadius - wallThickness, bottomRadius - wallThickness, 0.18, plankCount]}
                    position={[0, 0.09, 0]} receiveShadow
                >
                    <meshStandardMaterial map={woodTexture} color="#765334" roughness={0.95} />
                </Cylinder>

                {bandCenters.map(y => (
                    <mesh
                        key={y}
                        position={[0, y, 0]} rotation={[0, -Math.PI / plankCount, 0]}
                        castShadow receiveShadow
                    >
                        <latheGeometry args={[[
                            new Vector2(radiusAt(y - fittedBandWidth / 2) + 0.005, -fittedBandWidth / 2),
                            new Vector2(radiusAt(y - fittedBandWidth / 2) + bandThickness, -fittedBandWidth / 2),
                            new Vector2(radiusAt(y + fittedBandWidth / 2) + bandThickness, fittedBandWidth / 2),
                            new Vector2(radiusAt(y + fittedBandWidth / 2) + 0.005, fittedBandWidth / 2),
                            new Vector2(radiusAt(y - fittedBandWidth / 2) + 0.005, -fittedBandWidth / 2),
                        ], plankCount]} />
                        <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.42} />
                    </mesh>
                ))}
            </group>

            <WaterPlane
                radius={waterRadius} position={[0, height - waterInset, 0]}
            />
        </group>
    );
}
