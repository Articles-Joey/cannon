import MenuCard from "./MenuCard";
import Box from "@mui/material/Box";
import { useGameStore } from "@/hooks/useGameStore";

export default function Scoreboard() {
    const gameState = useGameStore((state) => state.gameState);
    return (
        <MenuCard>
            <Box
                sx={{
                    p: 1,
                    bgcolor: "action.hover",
                    ".panel-left &, .menu-bar &": {
                        bgcolor: "rgba(1, 159, 2, 0.5)",
                    },
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                Players
            </Box>
            <Box sx={{ p: 1 }}>
                {gameState?.players?.map((player) => (
                    <Box key={player.id}>
                        <Box>
                            {player.nickname}: {player.score || 0}
                        </Box>
                        <Box sx={{ fontSize: "0.875em" }}>
                            {player.rotation?.[0]?.toFixed(2)},{" "}
                            {player.rotation?.[1]?.toFixed(2)},{" "}
                            {player.rotation?.[2]?.toFixed(2)}
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box
                sx={{
                    p: 1,
                    bgcolor: "action.hover",
                    ".panel-left &, .menu-bar &": {
                        bgcolor: "rgba(1, 159, 2, 0.5)",
                    },
                    borderTop: 1,
                    borderColor: "divider",
                }}
            >
                Time Left: 0:00
            </Box>
        </MenuCard>
    );
}
