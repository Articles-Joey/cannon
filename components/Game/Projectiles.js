import { useCannonStore } from "@/hooks/useCannonStore";
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

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
                    // position={[-43, 1, 43]}
                    position={[5, 2, 43]}
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
    
    const isLatest = projectiles[projectiles.length - 1]?.id === item.id;
    const positionRef = useRef(position);

    const [ref, api] = useSphere(() => ({
        mass: 1, // Give the projectile some mass
        position: position, // Initial spawn position
        args: [0.5], // Sphere radius
        userData: { 
            tag: 'player-projectile',
            id: item.id
        }
    }));

    useEffect(() => {
        const unsubscribe = api.position.subscribe((v) => (positionRef.current = v));
        return unsubscribe;
    }, [api.position]);

    useFrame(() => {
        if (cameraFollowsProjectile && isLatest) {
            const [x, y, z] = positionRef.current;
            
            // Update controls target to look at the projectile
            if (controls) {
                controls.target.set(x, y, z);
                controls.update();
            }
            
            // Simple 3rd person follow (offset)
            camera.position.set(x, y + 6, z + 12);
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
            if (y < -1) {

                console.log("Remove this projectile", item)

                const { removeProjectile, setChangeCameraLocation, projectiles, cameraFollowsProjectile } = useCannonStore.getState();

                if (cameraFollowsProjectile && projectiles[projectiles.length - 1]?.id === item.id) {
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
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );

}