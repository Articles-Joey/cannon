import { useStore } from "@/hooks/useStore"
import { PaintBucket } from "../Models/PaintBucket"
import { Cylinder, Plane, useTexture } from "@react-three/drei"
import WaterPlane from "./WaterPlane"
import * as THREE from 'three'
import { degToRad } from "three/src/math/MathUtils.js"

export default function ScoreTarget() {
    const darkMode = useStore(state => state.darkMode)
    const toontownMode = useStore(state => state.toontownMode)

    const waterTowerBaseTexture = useTexture('img/toontown/water-tower-base.webp')
    const waterTowerSideTexture = useTexture('img/toontown/water-tower-side.webp')

    waterTowerBaseTexture.wrapS = THREE.RepeatWrapping
    waterTowerBaseTexture.wrapT = THREE.ClampToEdgeWrapping
    waterTowerBaseTexture.repeat.set(1, 1)

    waterTowerSideTexture.wrapS = THREE.RepeatWrapping
    waterTowerSideTexture.wrapT = THREE.ClampToEdgeWrapping
    waterTowerSideTexture.repeat.set(1, 1)

    const color = darkMode ? "#8B0000" : "red";
    const leanAngle = degToRad(6.75); // Lean the walls back by 10 degrees to test it out!

    const wallMaterial = (
        <meshStandardMaterial
            map={waterTowerBaseTexture}
            side={THREE.DoubleSide}
            transparent={true}
            depthWrite={false}
            alphaTest={0.25}
        />
    )

    // --- WALL CONFIGURATION ARRAY ---
    // Define the dimensions and the transform configurations for each wall face
    const wallWidth = 8
    const wallHeight = 15
    const radiusOffset = 4 // Distance from center to the wall face

    const wallConfigs = [
        { id: 'front', position: [0, -wallHeight / 2, radiusOffset], rotation: [0, 0, 0] },
        { id: 'back', position: [0, -wallHeight / 2, -radiusOffset], rotation: [0, Math.PI, 0] },
        { id: 'right', position: [radiusOffset, -wallHeight / 2, 0], rotation: [0, Math.PI / 2, 0] },
        { id: 'left', position: [-radiusOffset, -wallHeight / 2, 0], rotation: [0, -Math.PI / 2, 0] },
    ]

    const cylinderColor = darkMode ? "#fff" : "#a7a7a7";
    const cylinderMaterials = [
        // Index 0: Side (Your textured material)
        new THREE.MeshStandardMaterial({
            map: waterTowerSideTexture,
            color: new THREE.Color(cylinderColor),
            side: THREE.DoubleSide
        }),
        // Index 1: Top Cap
        // new THREE.MeshStandardMaterial({ color: false }),
        false,
        // Index 2: Bottom Cap
        new THREE.MeshStandardMaterial({ color: '#57351a' })
    ];

    if (toontownMode) {
        return (
            <group renderOrder={10}>
                <group position={[0, -6.5, 0]} renderOrder={10}>
                    {wallConfigs.map((wall) => (
                        /* 1. Base Wall Anchor Group (Positioned & Faced outward) */
                        <group key={wall.id} position={wall.position} rotation={wall.rotation}>

                            {/* 2. Pivot Group (Handles the lean from the bottom edge) */}
                            <group rotation={[-leanAngle, 0, 0]}>

                                {/* 3. The Plane (Shifted UP by half its height to put the origin at the bottom) */}
                                <Plane
                                    args={[wallWidth, wallHeight]}
                                    position={[0, wallHeight / 2, 0]}
                                    renderOrder={10}
                                >
                                    {wallMaterial}
                                </Plane>

                            </group>
                        </group>
                    ))}
                </group>

                <WaterPlane position={[0, 6, 0]} renderOrder={10} />

                <Cylinder
                    position={[0, 3.4, 0]}
                    args={[5, 4, 5.5, 8]}
                    material={cylinderMaterials}
                    renderOrder={10}
                />
                {/* <PaintBucket scale={50} renderOrder={10} /> */}

            </group>
        )
    } else {
        return (
            <group renderOrder={10}>

                <mesh castShadow position={[0, -14, 0]} renderOrder={10}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color={color} />
                </mesh>

                <Cylinder
                    position={[0, -7, 0]} args={[1, 1, 14, 8]} material-color={color} renderOrder={10}
                />

                <WaterPlane position={[0, 6, 0]} renderOrder={10} />

                <PaintBucket position={[0, -4, 0]} scale={80} renderOrder={10} />

            </group>
        )
    }
}