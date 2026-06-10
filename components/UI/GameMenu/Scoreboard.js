import { useGameStore } from "@/hooks/useGameStore";

export default function Scoreboard({ }) {

    const gameState = useGameStore(state => state.gameState);

    return (
        <div className="">
            <div className="card card-sm card-articles card-scoreboard">
                <div className="card-header">
                    Players
                </div>
                <div className="card-body">

                    {gameState?.players?.map((player) => {
                        return (
                            <div key={player.id}>
                                <div>{player.nickname}: {player.score || 0}</div>
                                <div className="small">
                                    {player.rotation?.[0]?.toFixed(2)}, {player.rotation?.[1]?.toFixed(2)}, {player.rotation?.[2]?.toFixed(2)}
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