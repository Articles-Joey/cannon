import { createContext, createRef, forwardRef, memo, use, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useCannonStore } from "@/hooks/useCannonStore";

import { Debug, Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import { useAudioStore } from "@/hooks/useAudioStore";
import useGameHelpers from "@/hooks/useGameHelpers";

export default function TowerAndWaterCollisionDetection({ position, args }) {

    // const removeProjectile = useCannonStore(state => state.removeProjectile)
    // const cameraFollowsProjectile = useCannonStore(state => state.cameraFollowsProjectile);

    const {
        increasePlayerScore
    } = useGameHelpers()

    const waterArgs = [4, 4, 0.25, 8];
    const [waterRef, api] = useCylinder(() => ({
        mass: 0,
        // type: 'Static',
        isTrigger: true,
        args: waterArgs,
        position: position,
        onCollide: (e) => {

            console.log(e.body)

            if (e.body?.userData?.tag === 'player-projectile') {
                console.log("Ball landed in bucket!", e.body.userData)

                const audioSettings = useAudioStore.getState().audioSettings
                if (audioSettings.enabled) {
                    const audio = new Audio('/audio/watersplash.ogg')
                    audio.volume = audioSettings.game_volume / 100
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
                increasePlayerScore(1, e.body.userData.ownerId)

            }

        }
    }))

    const towerArgs = [4, 4, 20, 8];
    const [towerRef, towerApi] = useCylinder(() => ({
        mass: 0,
        // type: 'Static',
        isTrigger: true,
        args: towerArgs,
        position: [
            position[0],
            position[1] - 10,
            position[2]
        ],
        onCollide: (e) => {

            // console.log(e.body)

            // return

            if (e.body?.userData?.tag === 'player-projectile') {
                console.log("Player hit tower!", e.body.userData)

                const audioSettings = useAudioStore.getState().audioSettings
                if (audioSettings.enabled) {
                    const audio = new Audio('/audio/Hit Tower.mp3')
                    audio.volume = audioSettings.game_volume / 100
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
        <group>

            <mesh ref={waterRef} castShadow>
                <cylinderGeometry args={args} />
                <meshStandardMaterial
                    transparent={true}
                    opacity={0}
                    color="red"
                />
            </mesh>

            <mesh ref={towerRef} castShadow>
                <cylinderGeometry args={args} />
                <meshStandardMaterial
                    transparent={true}
                    opacity={0}
                    color="red"
                />
            </mesh>

        </group>
    )

}