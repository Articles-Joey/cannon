import { useCannonStore } from "@/hooks/useCannonStore";
import { useSphere } from "@react-three/cannon";
import { useEffect } from "react";

export default function Projectiles() {

    const [ref, api] = useSphere(() => ({
        mass: 1,
        // type: 'Dynamic',
        args: [1, 1, 1],
        position: [-2, 5, 0],
    }))

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
                    position={[5, 0, 43]}
                    item={item}
                />
            })}
        </group>
    )

}

function Projectile({ position, velocity, item }) {

    // const {
    //     projectiles,
    //     setProjectiles,
    // } = useCannonStore(state => ({
    //     projectiles: state.projectiles,
    //     setProjectiles: state.setProjectiles,
    // }));

    const [ref, api] = useSphere(() => ({
        mass: 1, // Give the projectile some mass
        position: position, // Initial spawn position
        args: [0.5], // Sphere radius
    }));

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
            if (y < -10) {

                console.log("Remove this projectile", item)

                const removeProjectile = useCannonStore.getState().removeProjectile;

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