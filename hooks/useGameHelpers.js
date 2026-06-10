import { useSearchParams } from "next/navigation";
import { useGameStore } from "./useGameStore";
import { useCannonStore } from "./useCannonStore";

export default function useGameHelpers() {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server_type } = searchParamsObject

    const setGameState = useGameStore(state => state.setGameState)

    const setRandomGoalLocation = useCannonStore(state => state.setRandomGoalLocation);

    function startGame(status) {
        console.log("Game started");

        if (server_type == "single-player") {

            const gameState = useGameStore.getState().gameState

            setGameState({
                ...gameState,
                status: status || 'In Progress',
                timer: 0, // Set the initial timer value (e.g., 60 seconds)
                players: gameState.players.map(player => ({
                    ...player,
                    score: 0 // Initialize player scores to 0
                }))
            })

            setRandomGoalLocation();

        }

        if (server_type == "online-peer") {

        }

        if (server_type == "online-socket") {

        }

    }

    function increasePlayerScore(amount, playerId) {

        if (server_type == "single-player") {

            console.log(`Increasing player ${playerId} score by ${amount}`)

            const gameState = useGameStore.getState().gameState

            const updatedPlayers = gameState.players.map(player => {
                if (player.id === playerId) {
                    return {
                        ...player,
                        score: (player.score || 0) + amount
                    }
                }
                return player
            }
            )

            setGameState({
                ...gameState,
                players: updatedPlayers
            })
        }

    }

    return {
        startGame,
        increasePlayerScore
    }
}