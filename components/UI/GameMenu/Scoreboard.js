export default function Scoreboard({}) {

    let players = [
        { id: 1, name: "Player 1", score: 10 },
    ]

    return (
        <div className="">
            <div className="card card-sm card-articles card-scoreboard">
                <div className="card-header">
                    Scores
                </div>
                <div className="card-body">

                    {players.map((player) => {
                        return (
                            <div key={player.id}>{player.name}: {player.score}</div>
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