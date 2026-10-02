"use client";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";
import { useSearchParams } from "next/navigation";
import useGameHelpers from "@/hooks/useGameHelpers";
import Link from "next/link";
import { useScoreStore } from "@/hooks/useScoreStore";

export default function GameOverOverlay() {
    const serverType = useSearchParams().get("server_type");
    const gameState = useGameStore((state) => state.gameState);
    const maxScore = useScoreStore((state) => state.maxScore);
    const { startGame } = useGameHelpers();
    const playerScore = gameState?.players?.[0]?.score || 0;

    if (gameState?.status !== "Game Over") return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
                width: 300,
                maxWidth: "calc(100vw - 2rem)",
                bgcolor: "background.paper",
                color: "text.primary",
                border: 1,
                borderColor: "divider",
                borderRadius: "6px",
                overflow: "hidden",
            }}
        >
            <Box sx={{ py: 1, px: 2, borderBottom: 1, borderColor: "divider" }}>
                Game Over
            </Box>
            <Box sx={{ p: 2 }}>
                {serverType === "single-player" && (
                    <Box>
                        <Box>You had a final score of {playerScore}!</Box>
                        <Box>Your highest score is {maxScore}!</Box>
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    py: 1,
                    px: 2,
                    borderTop: 1,
                    borderColor: "divider",
                }}
            >
                <ArticlesButton
                    component={Link}
                    href="/"
                    sx={{ width: "50%" }}
                    startIcon={<CloseIcon />}
                >
                    Close
                </ArticlesButton>
                <ArticlesButton
                    sx={{ width: "50%" }}
                    onClick={() => startGame("In Lobby")}
                    startIcon={<PlayArrowIcon />}
                >
                    Play Again
                </ArticlesButton>
            </Box>
        </Box>
    );
}
