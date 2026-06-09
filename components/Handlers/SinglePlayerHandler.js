"use client";
// Attempting a socket server first architecture, but this component will handle the single player mode and local game state management.

import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react"
import { useStore } from "@/hooks/useStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { useCannonStore } from '@/hooks/useCannonStore';

const totalRounds = 5;

function generateMoveSequence(gameState, setGameState) {
}

function generateFallingItem(existingItems = []) {

    const spawnRange = 14;
    const MAX_ATTEMPTS = 20;

    const fallingItemTypes = [
        'Point',
        'Penalty',
        // 'PowerUp'
    ];

    let x, z, attempts = 0;
    do {
        x = Math.floor(Math.random() * spawnRange) - (spawnRange / 2);
        z = Math.floor(Math.random() * spawnRange) - (spawnRange / 2);
        attempts++;
    } while (
        attempts < MAX_ATTEMPTS &&
        existingItems.some(item => Math.sqrt((x - item.x) ** 2 + (z - item.z) ** 2) <= 1)
    );

    const id = uuidv4();
    const spawnedAt = new Date();
    const type = fallingItemTypes[Math.floor(Math.random() * fallingItemTypes.length)];

    return { id, x, z, type, spawnedAt };
}

export default function SinglePlayerHandler() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server, server_type } = params

    const socket = useSocketStore(state => state.socket)

    const nickname = useStore((state) => state.nickname)

    const gameState = useGameStore(state => state.gameState)
    const players = useGameStore(state => state.gameState.players)
    const status = useGameStore(state => state.gameState.status)
    const setGameState = useGameStore(state => state.setGameState)
    
    const setRandomGoalLocation = useCannonStore(state => state.setRandomGoalLocation);

    const playersLength = gameState?.players?.length || 0;

    const playersTotalScore = players?.reduce((total, player) => total + (player.score || 0), 0) || 0;

    useEffect(() => {
        
        if (server_type == "single-player") {

            setRandomGoalLocation();

        }

    }, [playersTotalScore])

    const {
        position: myPosition,
        playerRotation: myRotation,
    } = useCannonStore(state => ({
        position: state.position,
        playerRotation: state.playerRotation,
    }));

    if (server) {
        console.warn("Not single player mode, server param found:", server)
        return null;
    }

    useEffect(() => {

        if (playersLength == 0) return

        const gameState = useGameStore.getState().gameState;
        setGameState({
            ...gameState,
            players: [
                ...gameState?.players?.map(p => {
                    if (p.id === 'local') {
                        return {
                            ...p,
                            position: myPosition,
                            rotation: myRotation,
                        }
                    }
                    return p;
                }),
            ]
        })
    }, [
        myPosition, myRotation, playersLength
    ])

    useEffect(() => {

        console.warn("SinglePlayerHandler - Player length check", status)

        if (
            (players?.length || 0) === 0
            &&
            status !== 'Game Over'
            &&
            !status
        ) {

            console.warn("No players found in game state, adding local player.")

            setGameState({
                players: [{
                    id: 'local',
                    nickname: nickname,
                    health: 5,
                }],
                status: 'In Lobby',
                timer: 0,
                maxTime: 60,
                // fallingItems: (() => {
                //     const items = [];
                //     for (let i = 0; i < 3; i++) {
                //         items.push(generateFallingItem(items));
                //     }
                //     return items;
                // })()
            });

        }

    }, [players?.length, status])

    useEffect(() => {

        console.warn("SinglePlayerHandler - Status change detected", status)

        let interval;

        if (status === "In Progress") {

            // const {
            //     position: myPosition,
            //     playerRotation: myRotation,
            //     action: myAction,
            //     projectiles: localProjectiles
            // } = useCannonStore.getState();

            // generateMoveSequence(gameState, setGameState);

            interval = setInterval(() => {
                const currentGameState = useGameStore.getState().gameState;

                if (currentGameState.status !== 'In Progress') {
                    clearInterval(interval);
                    return;
                }

                const currentGameTimer = currentGameState.timer ?? 0;

                const now = Date.now();

                if (
                    currentGameTimer
                    >=
                    59
                    // 5
                ) {

                    setGameState({
                        ...currentGameState,
                        status: 'Game Over',
                        timer: 0
                    });

                    // useStore.getState().setShowGameOverModal({
                    //     rankings: [],
                    //     winner: {
                    //         nickname: "123",
                    //     }
                    // })

                } else {
                    setGameState({
                        ...currentGameState,
                        timer: currentGameTimer + 1,
                        // ...(currentGameState.fallingItems ?
                        //     {
                        //         fallingItems: currentGameState.fallingItems.reduce((acc, item) => {
                        //             if (now - item.spawnedAt > 5000) {
                        //                 acc.push(generateFallingItem(acc));
                        //             } else {
                        //                 // console.log("Not older", now - item.spawnedAt)
                        //                 acc.push(item);
                        //             }
                        //             return acc;
                        //         }, [])
                        //     }
                        //     :
                        //     {}
                        // ),
                    });
                }
            }, 1000);

        }

        return () => {
            if (interval) clearInterval(interval);
        };

    }, [status])

}