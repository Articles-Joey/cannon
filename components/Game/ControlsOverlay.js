import { useEffect } from "react"
import { useKeyboard } from "@/hooks/useKeyboard"
import { Vector3, Euler } from 'three';

import { useCannonStore } from "@/hooks/useCannonStore";

import ArticlesButton from "../UI/Button"

export default function ControlsOverlay(props) {

    const { moveUp, moveDown, moveRight, moveLeft, fire } = useKeyboard()

    const playerRotation = useCannonStore(state => state.playerRotation);
    const setPlayerRotation = useCannonStore(state => state.setPlayerRotation);
    const addProjectile = useCannonStore(state => state.addProjectile);
    // const projectiles = useCannonStore(state => state.projectiles);

    const handleFire = () => {
        console.log("FIRE!")
        
        const [pitch, yaw, roll] = useCannonStore.getState().playerRotation;
        const velocityMagnitude = 40;
        const direction = new Vector3(0, 0, 1); 
        const rotation = new Euler(pitch, yaw, roll, 'YXZ');
        direction.applyEuler(rotation);
        const velocity = direction.multiplyScalar(velocityMagnitude);

        addProjectile({
            player: 1,
            id: Math.random(),
            velocity: [velocity.x, velocity.y, velocity.z]
        })
    }

    useEffect(() => {
        if (fire) {
            handleFire();
        }
    }, [fire]);

    useEffect(() => {
        if (!moveUp && !moveDown && !moveLeft && !moveRight) return;

        const interval = setInterval(() => {
            const currentRotation = useCannonStore.getState().playerRotation;
            let [x, y, z] = currentRotation;

            if (moveUp) x -= 0.05;
            if (moveDown) x += 0.05;
            if (moveLeft) y += 0.05;
            if (moveRight) y -= 0.05;

            setPlayerRotation([x, y, z]);
        }, 20);

        return () => clearInterval(interval);
    }, [moveUp, moveDown, moveLeft, moveRight, setPlayerRotation]);

    return (
        <div className="controls-overlay">

            <ArticlesButton
                // small
                className="fire-button"
                onClick={handleFire}
            >
                <i className="fad fa-fire-alt me-0"></i>
            </ArticlesButton>

            {['up', 'down', 'left', 'right'].map(dir =>
                <ArticlesButton
                    key={dir}
                    className={`${dir}-button`}
                    active={dir == 'up' ? moveUp : dir == 'down' ? moveDown : dir == 'left' ? moveLeft : moveRight}
                    onClick={() => {

                        if (['up', 'down'].includes(dir)) {

                            console.log(dir)

                            let newAngle = playerRotation[0]

                            dir == 'up' ?
                                newAngle -= 0.1
                                :
                                newAngle += 0.1

                            setPlayerRotation([
                                newAngle,
                                playerRotation[1],
                                playerRotation[2]
                            ])

                        }

                        if (['left', 'right'].includes(dir)) {

                            console.log(dir)

                            let newAngle = playerRotation[1]

                            dir == 'right' ?
                                newAngle -= 0.1
                                :
                                newAngle += 0.1

                            setPlayerRotation([
                                playerRotation[0],
                                newAngle,
                                playerRotation[2]
                            ])

                        }

                    }}
                >
                    <i className={`fad fa-chevron-circle-${dir} me-0`}></i>
                </ArticlesButton>
            )}

        </div>
    )

}