import { useEffect, useState } from "react"
import { useKeyboard } from "@/hooks/useKeyboard"
import { Vector3, Euler } from 'three';

import { useCannonStore } from "@/hooks/useCannonStore";

import ArticlesButton from "../UI/Button"
import { useStore } from "@/hooks/useStore";

export default function ControlsOverlay(props) {

    const { moveUp, moveDown, moveRight, moveLeft, fire } = useKeyboard()

    const [activeButton, setActiveButton] = useState(null);

    const playerRotation = useCannonStore(state => state.playerRotation);
    const setPlayerRotation = useCannonStore(state => state.setPlayerRotation);
    const addProjectile = useCannonStore(state => state.addProjectile);
    // const projectiles = useCannonStore(state => state.projectiles);

    const aimSensitivity = useStore(state => state.aimSensitivity);
    const increaseAimSensitivity = useStore(state => state.increaseAimSensitivity);
    const decreaseAimSensitivity = useStore(state => state.decreaseAimSensitivity );

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

    const nudgeMapping = [
        {
            aimSensitivity: 1,
            nudgeAmount: 0.01
        },
        {
            aimSensitivity: 2,
            nudgeAmount: 0.02
        },
        {
            aimSensitivity: 3,
            nudgeAmount: 0.03
        },
    ]

    // const nudgeAmount = 0.05
    const nudgeAmount = nudgeMapping.find(nudge => nudge.aimSensitivity === aimSensitivity)?.nudgeAmount || 0.01;

    useEffect(() => {
        if (!moveUp && !moveDown && !moveLeft && !moveRight && !activeButton) return;

        const interval = setInterval(() => {
            const currentRotation = useCannonStore.getState().playerRotation;
            let [x, y, z] = currentRotation;

            if (moveUp || activeButton === 'up') x -= nudgeAmount;
            if (moveDown || activeButton === 'down') x += nudgeAmount;
            if (moveLeft || activeButton === 'left') y += nudgeAmount;
            if (moveRight || activeButton === 'right') y -= nudgeAmount;

            setPlayerRotation([x, y, z]);
        }, 20);

        return () => clearInterval(interval);
    }, [moveUp, moveDown, moveLeft, moveRight, activeButton, setPlayerRotation]);

    return (
        <div className="controls-overlay">

            <div className="sensitivity-buttons">
                <div 
                    className="badge bg-black badge-hover"
                    onClick={() => {
                        decreaseAimSensitivity()
                    }}
                >
                    <i className="fas fa-minus"></i>
                </div>
                <div className="badge bg-black">
                    {aimSensitivity}
                </div>
                <div 
                    className="badge bg-black badge-hover"
                    onClick={() => {
                        increaseAimSensitivity()
                    }}
                >
                    <i className="fas fa-plus"></i>
                </div>
            </div>

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
                    active={(dir == 'up' ? moveUp : dir == 'down' ? moveDown : dir == 'left' ? moveLeft : moveRight) || activeButton === dir}
                    onMouseDown={() => setActiveButton(dir)}
                    onMouseUp={() => setActiveButton(null)}
                    onMouseLeave={() => setActiveButton(null)}
                    onTouchStart={(e) => { e.preventDefault(); setActiveButton(dir); }}
                    onTouchEnd={(e) => { e.preventDefault(); setActiveButton(null); }}
                >
                    <i className={`fad fa-chevron-circle-${dir} me-0`}></i>
                </ArticlesButton>
            )}

        </div>
    )

}