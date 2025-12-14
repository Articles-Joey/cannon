import { createContext, createRef, forwardRef, memo, use, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import Tree from "@/components/Models/Tree";
import Duck from "@/components/Models/Duck";
import Sand from '@/components/Models/Sand';
import { Cannon } from "@/components/Models/Cannon";
import { PaintBucket } from "@/components/Models/PaintBucket";
import { Farm } from "@/components/Models/Farm";

import { useCannonStore } from "@/hooks/useCannonStore";
import { useStore } from '@/hooks/useStore';

import { Debug, Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import WaterPlane from "@/components/Game/WaterPlane";
import { degToRad } from "three/src/math/MathUtils";
import Projectiles from "./Projectiles";
import ChangeCameraLocationListener from "./ChangeCameraLocationListener";

import minGraphicsQuality from "@/util/minGraphicsQuality";

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

const GrassPlane = () => {

    const width = 110; // Set the width of the plane
    const height = 170; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 5)

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={texture} />
            </mesh>
        </>
    );
};

function GameCanvas(props) {

    // const GPUTier = useDetectGPU()

    const playerRotation = useCannonStore(state => state.playerRotation);
    // const setPlayerRotation = useCannonStore(state => state.setPlayerRotation);
    const goalLocation = useCannonStore(state => state.goalLocation);

    const darkMode = useStore(state => state.darkMode)
    const graphicsQuality = useStore(state => state.graphicsQuality)

    // const {
    //     handleCameraChange,
    //     gameState,
    //     players,
    //     move,
    //     cameraInfo,
    //     server
    // } = props;

    // const [[a, b, c, d, e]] = useState(() => [...Array(5)].map(createRef))

    return (
        <Canvas camera={{ position: [0, 40, 90], fov: 50 }}>

            <ChangeCameraLocationListener />

            <OrbitControls
                makeDefault
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            <Sky
                // distance={450000}
                sunPosition={[0, -10, 0]}
            // inclination={0}
            // azimuth={0.25}
            // {...props} 
            />

            <group>

                <group position={[-15, 0, 43]}>
                    <Cannon
                        scale={3}
                        rotation={[0, degToRad(180), 0]}
                    />
                    <Duck
                        position={[0, 0, 5]}
                        rotation={[0, -Math.PI / 2, 0]}
                        scale={1}
                    />
                </group>

                <group position={[-5, 0, 43]}>
                    <Cannon
                        scale={3}
                        rotation={[0, degToRad(180), 0]}
                    />
                    <Duck
                        position={[0, 0, 5]}
                        rotation={[0, -Math.PI / 2, 0]}
                        scale={1}
                    />
                </group>

                {/* Single Player */}
                <group position={[5, 0, 43]}>
                    <group
                        rotation={[0, playerRotation[1], 0]}
                        scale={3}

                    >
                        <Cannon
                            rotation={[playerRotation[0], 0, 0]}
                        />
                    </group>
                    <Duck
                        position={[0, 0, 5]}
                        rotation={[0, -Math.PI / 2, 0]}
                        scale={1}
                    />
                </group>

                <group position={[15, 0, 43]}>
                    <Cannon
                        scale={3}
                        rotation={[0, degToRad(180), 0]}
                    />
                    <Duck
                        position={[0, 0, 5]}
                        rotation={[0, -Math.PI / 2, 0]}
                        scale={1}
                    />
                </group>

            </group>

            {/* <group>
                <Farm
                    scale={0.1}
                    position={[0, 0, 70]}
                />

                <Farm
                    scale={0.1}
                    position={[-30, 0, 70]}
                />

                <Farm
                    scale={0.1}
                    position={[30, 0, 70]}
                />
            </group> */}

            {/* {minGraphicsQuality("Medium") && */}
                <group
                    visible={minGraphicsQuality("Medium", graphicsQuality) ? true : false}
                >
                    <Farm
                        scale={0.1}
                        position={[0, 0, -70]}
                        rotation={[0, -Math.PI, 0]}
                    />
                    <Farm
                        scale={0.1}
                        position={[30, 0, -70]}
                        rotation={[0, -Math.PI, 0]}
                    />
                    <Farm
                        scale={0.1}
                        position={[-30, 0, -70]}
                        rotation={[0, -Math.PI, 0]}
                    />
                </group>
            {/* } */}

            {/* {minGraphicsQuality("High") && <> */}
                <group
                    visible={minGraphicsQuality("High", graphicsQuality) ? true : false}
                >
                    {[...Array(60)].map((item, i) => {
                        return (
                            <group key={i}>
                                <Tree
                                    // key={i}
                                    scale={0.2}
                                    position={[-70, 0, (-88 + i * 3)]}
                                />
                                <Tree
                                    // key={i}
                                    scale={0.3}
                                    position={[-75, 0, (-88 + i * 3)]}
                                />
                            </group>
                        )
                    })}
    
                    {[...Array(60)].map((item, i) => {
                        return (
                            <group key={i}>
                                <Tree
                                    // key={i}
                                    scale={0.2}
                                    position={[70, 0, (-88 + i * 3)]}
                                />
                                <Tree
                                    // key={i}
                                    scale={0.3}
                                    position={[75, 0, (-88 + i * 3)]}
                                />
                            </group>
                        )
                    })}
                </group>
            {/* </>} */}

            <GrassPlane />

            <Sand
                args={[200, 200]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.2, 0]}
            />

            <ambientLight intensity={5} />
            <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} />

            {/* <pointLight position={[-10, -10, -10]} /> */}

            {/* <Nodes>
                <Node ref={a} name="a" color="#204090" position={[0, 2, 0]} connectedTo={[]} />
                <Node ref={b} name="b" color="#904020" position={[-10, 20, 10]} connectedTo={[d, a]} />
                <Node ref={d} name="d" color="#204090" position={[-43, 2.5, 43]} />
            </Nodes> */}

            <Physics
                gravity={[0, -18.82, 0]}
            >

                <Debug scale={1}>

                    <Projectiles />

                    <BucketCollisionDetection
                        position={[
                            goalLocation[0],
                            20,
                            goalLocation[2]
                        ]}
                        args={[3, 3, 0.25, 8]}
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

                        <Cylinder
                            position={[0, -7, 0]} args={[1, 1, 14, 8]} material-color="red"
                        />

                        <WaterPlane
                            position={[0, 6, 0]}
                        />

                        <PaintBucket
                            scale={50}
                        // position={[goalLocation[0], goalLocation[1], [goalLocation[2]]]}
                        // position={[0, 14, 0]}
                        />

                        <PlayerProjectile
                            position={[0, -7, 0]}
                        />

                        <Ground
                            position={[
                                0,
                                // goalLocation[1], 
                                -14,
                                0
                            ]}
                        />

                    </group>

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

function Ground({ position }) {

    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Static',
        args: [10, 0.5, 10],
        position: position,
    }))

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[10, 0.5, 10]} />
            {/* <BeachBall /> */}
            <meshStandardMaterial color="red" />
        </mesh>
    )

}

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
