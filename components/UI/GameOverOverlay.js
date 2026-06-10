"use client"
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";
import { useSearchParams } from "next/navigation";
import useGameHelpers from "@/hooks/useGameHelpers";
import Link from "next/link";
import { useScoreStore } from "@/hooks/useScoreStore";

export default function GameOverOverlay() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server, server_type } = params

    const gameState = useGameStore(state => state.gameState)
    const status = gameState?.status

    const maxScore = useScoreStore(state => state.maxScore)

    const {
        startGame
    } = useGameHelpers()

    const playerScore = useMemo(() => {

        if (server_type === "single-player") {
            return gameState?.players?.[0]?.score || 0
        }

    }, [gameState])

    if (status !== "Game Over") return null;

    return (
        <div className='game-over-overlay'>

            <div className="card">

                <div className="card-header">
                    Game Over
                </div>

                <div className="card-body">

                    {server_type === "single-player" &&
                        <div>
                            <div>You had a final score of {playerScore}!</div>
                            <div>Your highest score is {maxScore}!</div>
                        </div>
                    }

                </div>

                <div className="card-footer">

                    <Link href={"/"}>
                        <ArticlesButton
                            className="w-50"
                        >
                            <i className="fas fa-times me-2"></i>
                            Close
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton
                        className="w-50"
                        onClick={() => {
                            startGame("In Lobby")
                        }}
                    >
                        <i className="fas fa-play me-2"></i>
                        Play Again
                    </ArticlesButton>

                </div>

            </div>

        </div>
    )

}