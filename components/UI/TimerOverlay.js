import { useGameStore } from "@/hooks/useGameStore"
import { useStore } from "@/hooks/useStore"

export default function TimerOverlay() {

    const toontownMode = useStore(state => state.toontownMode)

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
                    zIndex: 2,

                    ...(timeLeft <= 10 ? { color: 'orange', fontWeight: 'bold' } : {}),

                    ...(timeLeft <= 5 ? { color: 'red', fontWeight: 'bold' } : {}),

                }}
            >
                {timeLeft || 0}
            </div>

            <img
                src={
                    toontownMode ?
                        "/img/toontown/toon-alarm-clock.webp"
                        :
                        "/img/toontown/alarm-clock-filled.webp"
                }
                style={{
                    ...!toontownMode && {
                        overflow: 'hidden',
                        transform: 'scale(1.25)',
                        // zIndex: 0,
                    }
                }}
                alt="Timer Icon"
                className=""
            />

        </div>
    )

}