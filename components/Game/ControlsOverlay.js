import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const sensitivityButtonSx = {
    bgcolor: "black", color: "white", opacity: 0.7, borderRadius: "6px",
    transition: "opacity 200ms", "&:hover": { bgcolor: "black", opacity: 1 },
};
const directionIcons = { up: ArrowCircleUpIcon, down: ArrowCircleDownIcon, left: ArrowCircleLeftIcon, right: ArrowCircleRightIcon };
const directionTransforms = {
    up: "translate(-50%, calc(-50% - 50px))",
    down: "translate(-50%, calc(-50% + 50px))",
    left: "translate(calc(-50% - 50px), -50%)",
    right: "translate(calc(-50% + 50px), -50%)",
};

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
    const decreaseAimSensitivity = useStore(state => state.decreaseAimSensitivity);

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
                        audio.play().catch(() => { });
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
        <Box data-hide-in-screenshot-mode="true" sx={{
            position: "fixed", bottom: "calc(50px + 1rem)", right: "50%",
            bgcolor: toontownMode ? "transparent" : "rgba(0, 0, 0, 0.75)",
            width: 160, height: 160, zIndex: 1, transform: "translateX(50%)",
            "@media (min-width: 992px)": {
                transform: "none", right: 50, bottom: 50, m: "1rem",
                ".show-sidebar &": { bottom: 50 },
            },
        }}>
            <Box sx={{
                position: "absolute", inset: 0, display: toontownMode ? "flex" : "none",
                justifyContent: "center", alignItems: "center", pointerEvents: "none",
            }}>
                <Box sx={{
                    backgroundImage: "url('/img/toontown/palette_2.png')",
                    transform: "scale(1.5)", backgroundPosition: "0px 0",
                    overflow: "hidden", width: 128, height: 128,
                }} />
            </Box>
            <Box sx={{
                position: "absolute", bottom: "-2.5rem", width: "100%",
                display: "flex", justifyContent: "center", alignItems: "center",
            }}>
                <IconButton aria-label="Decrease aim sensitivity" onClick={decreaseAimSensitivity} size="small" sx={sensitivityButtonSx}>
                    <RemoveIcon fontSize="inherit" />
                </IconButton>
                <Box sx={{ bgcolor: "black", color: "white", px: 1, py: 0.5, borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                    {aimSensitivity}
                </Box>
                <IconButton aria-label="Increase aim sensitivity" onClick={increaseAimSensitivity} size="small" sx={sensitivityButtonSx}>
                    <AddIcon fontSize="inherit" />
                </IconButton>
            </Box>
            <ArticlesButton aria-label="Fire cannon" onClick={handleFire} disableRipple
                sx={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    bgcolor: "red",
                    ...(toontownMode && {
                        "&, &:hover, &:active, &.active": { bgcolor: "transparent", border: 0, boxShadow: "none" },
                        width: 60, height: 60, p: 0, overflow: "hidden",
                        backgroundImage: "url('/img/toontown/palette_2.png')",
                        backgroundSize: "326px 326px", backgroundPosition: "1px -166px",
                        "&:hover": { backgroundPosition: "-57px -166px" },
                        "&:active": { backgroundPosition: "-118px -166px" },
                    }),
                }}>
                <LocalFireDepartmentIcon sx={{ display: toontownMode ? "none" : "block" }} />
            </ArticlesButton>
            {["up", "down", "left", "right"].map(dir => {
                const DirectionIcon = directionIcons[dir];
                return (
                    <ArticlesButton key={dir} aria-label={`Aim ${dir}`} disableRipple
                        active={(dir === "up" ? moveUp : dir === "down" ? moveDown : dir === "left" ? moveLeft : moveRight) || activeButton === dir}
                        onMouseDown={() => setActiveButton(dir)}
                        onMouseUp={() => setActiveButton(null)}
                        onMouseLeave={() => setActiveButton(null)}
                        onTouchStart={e => { e.preventDefault(); setActiveButton(dir); }}
                        onTouchEnd={e => { e.preventDefault(); setActiveButton(null); }}
                        onTouchCancel={() => setActiveButton(null)}
                        sx={{
                            position: "absolute", top: "50%", left: "50%",
                            transform: directionTransforms[dir],
                            ...(toontownMode && {
                                "&, &:hover, &:active, &.active": { bgcolor: "transparent", border: 0, boxShadow: "none" },
                                width: 60, height: 60, p: 0, overflow: "hidden",
                                backgroundImage: "url('/img/toontown/palette_2.png')",
                                backgroundSize: "326px 326px", backgroundPosition: "82px -4px",
                                "&:hover": { backgroundPosition: "82px -65px" },
                                "&:active, &.active": { backgroundPosition: "82px -126px" },
                            }),
                        }}>
                        <DirectionIcon sx={{ display: toontownMode ? "none" : "block" }} />
                    </ArticlesButton>
                );
            })}
        </Box>
    );
}
