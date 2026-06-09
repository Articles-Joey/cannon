import { useEffect, useState, useRef, useCallback } from "react"
import { useKeyboard } from "@/hooks/useKeyboard"
import { Vector3, Euler } from 'three';

import { useCannonStore } from "@/hooks/useCannonStore";
import { useGameServer } from "@/hooks/useGameServer";
import { useGamepad, getLeftStick } from "@/hooks/useGamepad";
import { useAudioStore } from "@/hooks/useAudioStore";

import ArticlesButton from "../UI/Button"
import { useStore } from "@/hooks/useStore";
import { useSearchParams } from "next/navigation";

export default function ControlsOverlay(props) {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server, server_type } = params

    const { moveUp, moveDown, moveRight, moveLeft, fire } = useKeyboard()

    const [activeButton, setActiveButton] = useState(null);
    const [stickMoving, setStickMoving] = useState(false);

    const toontownMode = useStore(state => state.toontownMode);

    const audioSettings = useAudioStore(state => state.audioSettings);

    const playerRotation = useCannonStore(state => state.playerRotation);
    const setPlayerRotation = useCannonStore(state => state.setPlayerRotation);
    const addProjectile = useCannonStore(state => state.addProjectile);
    // const projectiles = useCannonStore(state => state.projectiles);

    const aimSensitivity = useStore(state => state.aimSensitivity);
    const increaseAimSensitivity = useStore(state => state.increaseAimSensitivity);
    const decreaseAimSensitivity = useStore(state => state.decreaseAimSensitivity );

    // Gamepad support
    const { fireRef: gamepadFireRef } = useGamepad();
    const handleFireRef = useRef(null);

    const handleFire = useCallback(() => {
        console.log("FIRE!")
        
        const { playerRotation: rot, position: cannonPos } = useCannonStore.getState();
        const [pitch, yaw, roll] = rot;
        const velocityMagnitude = 40;
        const direction = new Vector3(0, 0, 1); 
        const rotation = new Euler(pitch, yaw, roll, 'YXZ');
        direction.applyEuler(rotation);
        const velocity = direction.multiplyScalar(velocityMagnitude);

        // Spawn at cannon tip: offset along the barrel direction
        const spawnOffset = new Vector3(0, 0, 1);
        spawnOffset.applyEuler(rotation);
        spawnOffset.multiplyScalar(3); // barrel length offset
        const spawnPos = [
            cannonPos[0] + spawnOffset.x,
            cannonPos[1] + 4 + spawnOffset.y, // +4 to account for cannon height and avoid ground collision
            cannonPos[2] + spawnOffset.z
        ];

        const { isHost, peer } = useGameServer.getState();

        const projectileData = {
            player: 1,
            id: Math.random(),
            velocity: [velocity.x, velocity.y, velocity.z],
            position: spawnPos,
            ownerId: server_type === 'single-player' ?
            'local'
            :
            peer?.id || 'host'
        };

        if ((isHost && server_type == 'online-peer') || (server_type === 'single-player')) {
            // Host: add projectile directly (physics runs locally)
            addProjectile(projectileData);
        } else {
            // Client: send fire event to host, host will simulate physics
            // We DON'T add locally — we'll receive it back via gameState
            const hostConn = peer?._connections;
            // Use a simpler approach: broadcast via the PeerManager's connection ref
            // Since we can't access connectionsRef here, send through the peer directly
            const conns = peer?.connections;
            if (conns) {
                Object.values(conns).flat().forEach(conn => {
                    if (conn?.open) {
                        conn.send({ type: 'fireProjectile', data: projectileData });
                    }
                });
            }
        }
    }, [addProjectile]);

    // Keep a ref to handleFire for the gamepad loop
    handleFireRef.current = handleFire;

    // Adjustment sound
    const adjustAudioRef = useRef(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            adjustAudioRef.current = new Audio("/audio/adjust.mp3");
        }
        return () => {
            if (adjustAudioRef.current) {
                adjustAudioRef.current.pause();
                adjustAudioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (fire) {
            handleFire();
        }
    }, [fire, handleFire]);

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

    // Gamepad polling: left stick for aiming, RT/A for fire
    useEffect(() => {
        const interval = setInterval(() => {
            const [stickX, stickY] = getLeftStick();
            const isStickMoving = stickX !== 0 || stickY !== 0;

            if (isStickMoving !== stickMoving) {
                setStickMoving(isStickMoving);
            }

            // Left stick adjusts cannon rotation
            if (isStickMoving) {
                const currentRotation = useCannonStore.getState().playerRotation;
                let [x, y, z] = currentRotation;
                const stickSensitivity = nudgeAmount * 1.5;
                x -= stickY * stickSensitivity; // stick up = pitch up
                y -= stickX * stickSensitivity; // stick right = yaw right
                setPlayerRotation([x, y, z]);
            }

            // Fire on gamepad button press
            if (gamepadFireRef.current) {
                gamepadFireRef.current = false;
                handleFireRef.current?.();
            }
        }, 20);

        return () => clearInterval(interval);
    }, [nudgeAmount, setPlayerRotation, gamepadFireRef, stickMoving]);

    useEffect(() => {
        const isCurrentlyMoving = moveUp || moveDown || moveLeft || moveRight || !!activeButton || stickMoving;
        const audio = adjustAudioRef.current;

        if (audio) {
            if (audioSettings?.enabled) {
                audio.volume = (audioSettings.game_volume || 50) / 100;
                if (isCurrentlyMoving) {
                    audio.loop = true;
                    if (audio.paused) {
                        audio.play().catch(() => {});
                    }
                } else {
                    audio.loop = false;
                }
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }, [moveUp, moveDown, moveLeft, moveRight, activeButton, stickMoving, audioSettings]);

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
        <div className={`controls-overlay hide-in-screenshot-mode ${toontownMode ? 'toontown-mode' : ''}`}>

            <div className="controls-background-container">
                <div 
                className="controls-background"
                style={{
                    backgroundImage: "url('/img/toontown/palette_2.png')",
                }}
                ></div>
            </div>

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
                    className={`${dir}-button directional-button`}
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