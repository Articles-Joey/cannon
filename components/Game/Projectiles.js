import { useCannonStore } from "@/hooks/useCannonStore";
import { useGameServer } from "@/hooks/useGameServer";
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef, memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ModelMan } from '../Models/Man'
import { useAudioStore } from "@/hooks/useAudioStore";
import { Vector3 } from "three";
import { useStore } from "@/hooks/useStore";
import { ModelToon } from "../Models/Toon";
import { degToRad } from "three/src/math/MathUtils.js";
import { useSearchParams } from "next/navigation";

const DEFAULT_VELOCITY = [-1.5, 26, -10];
const DEFAULT_POSITION = [5, 2, 43];

export default function Projectiles() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server, server_type } = params

    const projectiles = useCannonStore(state => state.projectiles);
    const localPeerId = useGameServer(state => state.peer)?.id;

    // Only track camera for my own projectiles, and only the latest one I fired
    const myProjectiles = projectiles.filter(p => 
        server_type === 'single-player' ?
            p.ownerId === 'local'
            :
            p.ownerId === localPeerId || (p.ownerId === 'host' && !localPeerId)
    );

    const latestId = myProjectiles.length > 0 ? myProjectiles[myProjectiles.length - 1].id : null;

    return (
        <group>
            {projectiles.map((item) => {

                const isOwner =
                    server_type === 'single-player' ?
                        item.ownerId === 'local'
                        :
                        item.ownerId === localPeerId || (item.ownerId === 'host' && !localPeerId);

                const isMyLatest = item.id === latestId;

                return <Projectile
                    key={item.id}
                    velocity={item.velocity || DEFAULT_VELOCITY}
                    position={item.position || DEFAULT_POSITION}
                    item={item}
                    isOwner={isOwner}
                    ownerId={item.ownerId}
                    isMyLatest={isMyLatest}
                />
            })}
        </group>
    )

}

const Projectile = memo(function Projectile({ position, velocity, item, isOwner, ownerId, isMyLatest }) {

    const { camera, controls } = useThree();
    const cameraFollowsProjectile = useCannonStore(state => state.cameraFollowsProjectile);

    const toontownMode = useStore(state => state.toontownMode)

    const positionRef = useRef(position);
    const velocityRef = useRef([0, 0, 0]);
    const manRef = useRef();
    const spawnTimeRef = useRef(Date.now());
    const cameraTargetRef = useRef(new Vector3());
    const cameraPositionRef = useRef(new Vector3());

    const [ref, api] = useSphere(() => ({
        mass: 1, // Give the projectile some mass
        position: position, // Initial spawn position
        fixedRotation: true,
        collisionResponse: false, // Start with no collision — grace period
        args: [0.5], // Sphere radius
        userData: {
            tag: 'player-projectile',
            id: item.id,
            ownerId: ownerId
        }
    }));

    // Enable collision after 1 second grace period
    useEffect(() => {
        const timer = setTimeout(() => {
            api.collisionResponse.set(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, [api]);

    // Force despawn after 15 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Force despawn projectile (15s timeout)", item.id);
            const { removeProjectile, setChangeCameraLocation, cameraFollowsProjectile } = useCannonStore.getState();
            if (isOwner && cameraFollowsProjectile) {
                setChangeCameraLocation([0, 10, 80]);
            }
            removeProjectile(item.id);
        }, 15000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const unsubscribe = api.position.subscribe((v) => (positionRef.current = v));
        return unsubscribe;
    }, [api.position]);

    useEffect(() => {
        const unsubscribe = api.velocity.subscribe((v) => (velocityRef.current = v));
        return unsubscribe;
    }, [api.velocity]);

    useFrame((_, delta) => {
        const smoothing = 1 - Math.exp(-delta * 8);

        if (cameraFollowsProjectile && isOwner && isMyLatest) {
            const [x, y, z] = positionRef.current;

            // Old Way
            // Update controls target to look at the projectile
            // if (controls) {
            //     controls.target.set(x, y, z);
            //     controls.update();
            // }
            // Simple 3rd person follow (offset)
            // camera.position.set(x, y + 6, z + 12);

            const desiredTarget = cameraTargetRef.current.set(x, y, z);
            const desiredCameraPosition = cameraPositionRef.current.set(x, y + 6, z + 12);

            if (controls) {
                controls.target.lerp(desiredTarget, smoothing);
                controls.update();
            }

            camera.position.lerp(desiredCameraPosition, smoothing);
        }

        if (manRef.current) {
            manRef.current.lookAt(
                velocityRef.current[0],
                velocityRef.current[1],
                velocityRef.current[2]
            )
        }
    });

    // Set initial velocity after the sphere is created

    // Set initial velocity after the sphere is created
    // useRef(() => {
    //     api.velocity.set(
    //         // ...velocity
    //         0, 500, 0
    //     );
    // }, [api, velocity]);

    useEffect(() => {
        api.velocity.set(...velocity);
    }, [api, velocity]);

    useEffect(() => {

        const unsubscribe = api.position.subscribe(([x, y, z]) => {
            // Grace period: don't check ground collision for first 2 seconds
            if (Date.now() - spawnTimeRef.current < 2000) return;

            if (y < -1) {

                console.log("Remove this projectile", item)

                const { removeProjectile, setChangeCameraLocation, cameraFollowsProjectile } = useCannonStore.getState();

                const { playSound } = useAudioStore.getState();
                playSound("audio/Hit Dirt.mp3");

                if (isOwner && cameraFollowsProjectile) {
                    setChangeCameraLocation([
                        0,
                        10,
                        80
                    ])
                }

                // api.mass.set(0)

                removeProjectile(item.id)
            }
        });

        return () => unsubscribe(); // Cleanup subscription

    }, [api.position]);

    return (
        <group ref={ref}>

            <group
                ref={manRef}
                position={[0, toontownMode ? 0 : -2, 0]}
                scale={0.5}
            >

                {toontownMode ?
                    <ModelToon
                        position={[0, -2, 0]}
                        // rotation={[0, degToRad(180), 0]}
                        scale={1}
                        action={"medium_shorts_toon_rig|swim"}
                    />
                    :
                    <ModelMan
                        action={"HumanArmature|Man_Clapping"}
                    />
                }

            </group>

        </group>
    );

});