import { useState } from "react";
import Box from "@mui/material/Box";
import { useControllerStore } from "@/hooks/useControllerStore";
import ArticlesButton from "@/components/UI/Button";

export default function ControllerUICard() {
    const controllerState = useControllerStore(
        (state) => state.controllerState,
    );
    const [showControllerState, setShowControllerState] = useState(false);

    if (!controllerState?.connected) return null;

    return (
        <Box sx={{ color: "#212529", border: 1, borderColor: "divider" }}>
            <Box
                sx={{
                    p: 0.5,
                    borderBottom: "1px solid #212529",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                }}
            >
                {controllerState.id}
            </Box>
            <Box sx={{ p: 0.5 }}>
                <ArticlesButton
                    small
                    fullWidth
                    active={showControllerState}
                    onClick={() => setShowControllerState((prev) => !prev)}
                >
                    {showControllerState ? "Hide" : "Show"} Controller Preview
                </ArticlesButton>
            </Box>
        </Box>
    );
}
