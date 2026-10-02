import MenuCard from "./GameMenu/MenuCard";
import { Box, Chip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useGameServer } from "@/hooks/useGameServer";
import ArticlesButton from "./Button";

export default function PeerDetails() {
    const peer = useGameServer((state) => state.peer);
    const isHost = useGameServer((state) => state.isHost);
    const displayId = useGameServer((state) => state.displayId);
    if (!peer || !displayId) return null;

    return (
        <MenuCard sx={{ p: 1 }}>
            <Box sx={{ fontSize: "0.875em", opacity: 0.75 }}>
                Multiplayer Peer Info
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: 1,
                    borderColor: "divider",
                    p: 0.5,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ArticlesButton
                        aria-label="Copy invite link"
                        sx={{ mr: 1 }}
                        onClick={() => {
                            navigator.clipboard.writeText(
                                window.location.origin +
                                    "/play?server=" +
                                    displayId,
                            );
                        }}
                    >
                        <ContentCopyIcon fontSize="small" />
                    </ArticlesButton>
                    <Box component="span">
                        ID:{" "}
                        <Box component="strong" sx={{ fontSize: "1.25rem" }}>
                            {displayId}
                        </Box>
                    </Box>
                </Box>
                {isHost && <Chip size="small" color="success" label="HOST" />}
            </Box>
            <Box sx={{ opacity: 0.75, mt: 0.5, fontSize: "0.8rem" }}>
                Share this ID with friends to play together! Clipboard button
                copies the invite link.
            </Box>
        </MenuCard>
    );
}
