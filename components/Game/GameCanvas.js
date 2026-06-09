import { createContext, createRef, forwardRef, memo, use, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text, Stats } from "@react-three/drei";

import { Vector3 } from "three";

// import { PaintBucket } from "@/components/Models/PaintBucket";

import { useCannonStore } from "@/hooks/useCannonStore";
import { useStore } from '@/hooks/useStore';

import { Debug, Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import WaterPlane from "@/components/Game/WaterPlane";
import { degToRad } from "three/src/math/MathUtils";
import Projectiles from "./Projectiles";
import ChangeCameraLocationListener from "./ChangeCameraLocationListener";

import minGraphicsQuality from "@/util/minGraphicsQuality";
import Players from "./Players";
import { useAudioStore } from "@/hooks/useAudioStore";
import GrassPlane from "./GrassPlane";
import GrassArea from "./GrassArea";
import TreesArea from "./TreesArea";
import ImageRing from "./ImageRing";
import FenceRing from "./FenceRing";
import ScoreTarget from "./ScoreTarget";
import TowerAndWaterCollisionDetection from "./TowerAndWaterCollisionDetection";

function GameCanvas({
    landingAnimationMode = false,
}) {

    const debug = useStore(state => state.debug);

    const goalLocation = useCannonStore(state => state.goalLocation);

    const darkMode = useStore(state => state.darkMode)
    const graphicsQuality = useStore(state => state.graphicsQuality)

    const showStats = useStore((state) => state?.debugConfig?.showStats);

    return (
        <Canvas camera={{ position: [0, 40, 90], fov: 50 }}>

            {showStats && <>
                <Stats className="stats-overlay" />
            </>}

            <ChangeCameraLocationListener />

            <OrbitControls
                makeDefault
                autoRotate={landingAnimationMode}
                target={landingAnimationMode ? [50, 0, 0] : [0, 0, 0]}
                enableDamping
                dampingFactor={0.08}
                minDistance={8}
                maxDistance={120}
                minPolarAngle={0.2}
                maxPolarAngle={Math.PI / 2 - 0.05}
            />

            <ImageRing />
            <FenceRing />

            {darkMode ?
                <>
                    <ambientLight intensity={0.25} />
                    <spotLight intensity={15000} position={[0, 100, 0]} angle={15} penumbra={1} />
                    <Sky
                        sunPosition={[0, -1, 0]}
                    />
                </>
                :
                <>
                    <ambientLight intensity={2} />
                    <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} />
                    <Sky
                        sunPosition={[0, 1, 0]}
                    />
                </>
            }

            <Players />

            <TreesArea />
            <GrassPlane />
            <GrassArea />

            <Physics
                gravity={[0, -18.82, 0]}
            >

                <Debug
                    scale={
                        debug ? 1 : 0
                    }
                >

                    <Projectiles />

                    {/* TODO - Make this all in one? */}
                    <group>
                        <TowerAndWaterCollisionDetection
                            position={[
                                goalLocation[0],
                                20,
                                goalLocation[2]
                            ]}
                        />
    
                        <group
                            // position={[0, 14, 0]}
                            position={[
                                goalLocation[0],
                                // goalLocation[1], 
                                14,
                                goalLocation[2]
                            ]}
                        >
    
                            <ScoreTarget />
    
                        </group>
                    </group>

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

const context = createContext()

const Circle = forwardRef(({ children, opacity = 1, radius = 0.05, segments = 32, color = '#ff1050', ...props }, ref) => (
    <mesh ref={ref} {...props}>
        <circleGeometry args={[radius, segments]} />
        <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color} />
        {children}
    </mesh>
))
Circle.displayName = 'Circle'