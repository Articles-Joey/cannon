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
                    <ambientLight intensity={5} />
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

                    <BucketCollisionDetection
                        position={[
                            goalLocation[0],
                            20,
                            goalLocation[2]
                        ]}
                        args={[2, 2, 0.25, 8]}
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

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

function BucketCollisionDetection({ position, args }) {

    // const removeProjectile = useCannonStore(state => state.removeProjectile)
    // const cameraFollowsProjectile = useCannonStore(state => state.cameraFollowsProjectile);

    const [ref, api] = useCylinder(() => ({
        mass: 0,
        // type: 'Static',
        isTrigger: true,
        args: args,
        position: position,
        onCollide: (e) => {

            console.log(e.body)

            if (e.body.userData?.tag === 'player-projectile') {
                console.log("Ball landed in bucket!", e.body.userData)

                const audioSettings = useAudioStore.getState().audioSettings
                if (audioSettings.enabled) {
                    const audio = new Audio('/audio/watersplash.ogg')
                    audio.volume = audioSettings.soundEffectsVolume / 100
                    try {
                        audio.play()
                    } catch (error) {
                        console.error("Audio playback failed", error)
                    }
                }

                const {
                    removeProjectile,
                    setChangeCameraLocation,
                    projectiles,
                    cameraFollowsProjectile
                } = useCannonStore.getState();

                if (
                    cameraFollowsProjectile
                    // && 
                    // projectiles[projectiles.length - 1]?.id === item.id
                ) {
                    setChangeCameraLocation([
                        0,
                        10,
                        80
                    ])
                }

                removeProjectile(e.body.userData.id)
            }

        }
    }))

    useEffect(() => {
        console.log("position updated")
        api.position.set(position[0], position[1], position[2])
    }, [position])

    return (
        <mesh ref={ref} castShadow>
            <cylinderGeometry args={args} />
            <meshStandardMaterial
                transparent={true}
                opacity={0}
                color="red"
            />
        </mesh>
    )

}

function PlayerProjectile() {

    const [ref, api] = useSphere(() => ({
        mass: 1,
        // type: 'Dynamic',
        args: [1, 1, 1],
        position: [2, 5, 0],
    }))

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[1, 10, 10]} />
            {/* <BeachBall /> */}
            <meshStandardMaterial color="red" />
        </mesh>
    )

}

const context = createContext()

const Circle = forwardRef(({ children, opacity = 1, radius = 0.05, segments = 32, color = '#ff1050', ...props }, ref) => (
    <mesh ref={ref} {...props}>
        <circleGeometry args={[radius, segments]} />
        <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color} />
        {children}
    </mesh>
))
Circle.displayName = 'Circle'

export function Nodes({ children }) {
    const group = useRef()
    const [nodes, set] = useState([])
    const lines = useMemo(() => {
        const lines = []
        for (let node of nodes)
            node.connectedTo
                .map((ref) => [node?.position, ref.current?.position])
                .forEach(([start, end]) => lines.push({ start: start.clone().add({ x: 0.35, y: 0, z: 0 }), end: end.clone().add({ x: -0.35, y: 0, z: 0 }) }))
        return lines
    }, [nodes])
    useFrame((_, delta) => group.current.children.forEach((group) => (group.children[0].material.uniforms.dashOffset.value -= delta * 10)))
    return (
        <context.Provider value={set}>
            <group ref={group}>
                {lines.map((line, index) => (
                    <group key={index}>
                        <QuadraticBezierLine key={index} {...line} color="white" dashed dashScale={50} gapSize={20} />
                        <QuadraticBezierLine key={index} {...line} color="black" lineWidth={10} transparent opacity={0.25} />
                    </group>
                ))}
            </group>
            {children}
            {lines.map(({ start, end }, index) => (
                <group key={index} position-z={1}>
                    <Circle position={start} />
                    <Circle position={end} />
                </group>
            ))}
        </context.Provider>
    )
}

export const Node = forwardRef(({ color = 'black', name, connectedTo = [], position = [0, 0, 0], ...props }, ref) => {
    const set = useContext(context)
    const { size, camera } = useThree()
    const [pos, setPos] = useState(() => new Vector3(...position))
    const state = useMemo(() => ({ position: pos, connectedTo }), [pos, connectedTo])
    // Register this node on mount, unregister on unmount
    useLayoutEffect(() => {
        set((nodes) => [...nodes, state])
        return () => void set((nodes) => nodes.filter((n) => n !== state))
    }, [state, pos])
    // Drag n drop, hover
    const [hovered, setHovered] = useState(false)
    useEffect(() => void (document.body.style.cursor = hovered ? 'grab' : 'auto'), [hovered])
    // const bind = useDrag(({ down, xy: [x, y] }) => {
    //     document.body.style.cursor = down ? 'grabbing' : 'grab'
    //     setPos(new Vector3((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1, 0).unproject(camera).multiply({ x: 1, y: 1, z: 0 }).clone())
    // })
    const bind = () => { }
    return (
        <Circle ref={ref} {...bind()} opacity={0.2} radius={0.5} color={color} position={pos} {...props}>
            <Circle
                radius={0.25}
                position={[0, 0, 0.1]}
                // onPointerOver={() => setHovered(true)}
                // onPointerOut={() => setHovered(false)}
                color={hovered ? '#ff1050' : color}>
                <Text position={[0, 0, 1]} fontSize={0.25}>
                    {name}
                </Text>
            </Circle>
        </Circle>
    )
})
Node.displayName = 'Node'
