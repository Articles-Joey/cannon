import { useGameStore } from "@/hooks/useGameStore";

export default function Scoreboard({ }) {

    const gameState = useGameStore(state => state.gameState);

    return (
        <div className="">
            <div className="card card-sm card-articles card-scoreboard">
                <div className="card-header">
                    Player Scores
                </div>
                <div className="card-body">

                    {gameState?.players?.map((player) => {
                        return (
                            <div key={player.id}>
                                <div>{player.nickname}: {player.score || 0}</div>
                                <div>
                                    {player.rotation || "?"}
                                </div>
                            </div>
                        );
                    })}

                </div>
                <div className="card-footer">
                    Time Left: 0:00
                </div>
            </div>
        </div>
    )

}