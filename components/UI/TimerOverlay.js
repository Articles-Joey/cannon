import { useGameStore } from "@/hooks/useGameStore"

export default function TimerOverlay() {

    const gameState = useGameStore(state => state.gameState)
    const maxTime = useGameStore(state => state.gameState?.maxTime)
    const timer = useGameStore(state => state.gameState?.timer)

    const timeLeft = maxTime - timer;

    return (
        <div className="game-timer-overlay">

            <div
                className="timer"
                style={{

                    color: 'black',

                    ...(timeLeft <= 10 ? { color: 'orange', fontWeight: 'bold' } : {}),

                    ...(timeLeft <= 5 ? { color: 'red', fontWeight: 'bold' } : {}),

                }}
            >
                {timeLeft || 0}
            </div>

            <img src="/img/toontown/toon-alarm-clock.webp" alt="Timer Icon" className="" />

        </div>
    )

}