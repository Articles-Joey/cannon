import Box from "@mui/material/Box";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";

export default function TimerOverlay() {
    const toontownMode = useStore((state) => state.toontownMode);
    const maxTime = useGameStore((state) => state.gameState?.maxTime);
    const timer = useGameStore((state) => state.gameState?.timer);
    const timeLeft = maxTime - timer;

    return (
        <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "48%",
                    transform: "translate(-50%, -50%)",
                    fontFamily: '"Minnie", cursive',
                    fontSize: "1.75rem",
                    color:
                        timeLeft <= 5
                            ? "red"
                            : timeLeft <= 10
                              ? "orange"
                              : "black",
                    fontWeight: timeLeft <= 10 ? "bold" : "normal",
                    zIndex: 2,
                }}
            >
                {timeLeft || 0}
            </Box>
            <Box
                component="img"
                src={
                    toontownMode
                        ? "/img/toontown/toon-alarm-clock.webp"
                        : "/img/toontown/alarm-clock-filled.webp"
                }
                alt="Timer Icon"
                sx={{
                    width: 100,
                    height: 100,
                    ...(!toontownMode && {
                        overflow: "hidden",
                        transform: "scale(1.25)",
                    }),
                }}
            />
        </Box>
    );
}
