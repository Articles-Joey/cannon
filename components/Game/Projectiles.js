import { useCannonStore } from "@/hooks/useCannonStore";
import { useGameServer } from "@/hooks/useGameServer";
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { Model as Man } from '../Models/Man'

export default function Projectiles() {

    // const [ref, api] = useSphere(() => ({
    //     mass: 1,
    //     // type: 'Dynamic',
    //     args: [1, 1, 1],
    //     position: [-2, 5, 0],
    // }))

    const projectiles = useCannonStore(state => state.projectiles);

    return (
        <group>
            {projectiles.map((item, item_i) => {
                return <Projectile
                    key={item.id}
                    velocity={item.velocity || [
                        -1.5,
                        26,
                        -10
                    ]}
                    position={item.position || [5, 2, 43]}
                    item={item}
                />
            })}
        </group>
    )

}

function Projectile({ position, velocity, item }) {

    const { camera, controls } = useThree();
    const projectiles = useCannonStore(state => state.projectiles);
    const cameraFollowsProjectile = useCannonStore(state => state.cameraFollowsProjectile);
    const localPeerId = useGameServer(state => state.peer)?.id;
    
    // Only track camera for my own projectiles, and only the latest one I fired
    const myProjectiles = projectiles.filter(p => p.ownerId === localPeerId || p.ownerId === 'host' && !localPeerId);
    const isMyLatest = myProjectiles.length > 0 && myProjectiles[myProjectiles.length - 1]?.id === item.id;
    const isOwner = item.ownerId === localPeerId || (item.ownerId === 'host' && !localPeerId);
    const positionRef = useRef(position);
    const velocityRef = useRef([0, 0, 0]);
    const manRef = useRef();
    const spawnTimeRef = useRef(Date.now());

    const [ref, api] = useSphere(() => ({
        mass: 1, // Give the projectile some mass
        position: position, // Initial spawn position
        fixedRotation: true,
        collisionResponse: false, // Start with no collision — grace period
        args: [0.5], // Sphere radius
        userData: { 
            tag: 'player-projectile',
            id: item.id
        }
    }));

    // Enable collision after 2 second grace period
    useEffect(() => {
        const timer = setTimeout(() => {
            api.collisionResponse.set(true);
        }, 2000);
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

    useFrame(() => {
        if (cameraFollowsProjectile && isOwner && isMyLatest) {
            const [x, y, z] = positionRef.current;
            
            // Update controls target to look at the projectile
            if (controls) {
                controls.target.set(x, y, z);
                controls.update();
            }
            
            // Simple 3rd person follow (offset)
            camera.position.set(x, y + 6, z + 12);
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
        api.velocity.set(...velocity); // Spread the velocity array
    }, []);

    useEffect(() => {

        const unsubscribe = api.position.subscribe(([x, y, z]) => {
            // Grace period: don't check ground collision for first 2 seconds
            if (Date.now() - spawnTimeRef.current < 2000) return;

            if (y < -1) {

                console.log("Remove this projectile", item)

                const { removeProjectile, setChangeCameraLocation, cameraFollowsProjectile } = useCannonStore.getState();

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
                position={[0, -2, 0]}
                scale={0.5}
            >
                <Man />
            </group>

        </group>
    );

}