"use client";
import MenuCard from "./MenuCard";

import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArticlesButton from "@/components/UI/Button";
import { useCannonStore } from "@/hooks/useCannonStore";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import { useStore } from "@/hooks/useStore";
import DebugControls from "./DebugControls";
import ControllerUICard from "./ControllerUICard";
import Scoreboard from "./Scoreboard";
import PeerDetails from "../PeerDetails";
import useGameHelpers from "@/hooks/useGameHelpers";
import { useGameStore } from "@/hooks/useGameStore";

function LeftPanelContent() {
    const gameState = useGameStore((state) => state.gameState);
    const { startGame } = useGameHelpers();
    const setDebug = useCannonStore((state) => state.setDebug);
    const debug = useCannonStore((state) => state.debug);
    const cameraMode = useCannonStore((state) => state.cameraMode);
    const setCameraMode = useCannonStore((state) => state.setCameraMode);
    const reloadScene = useStore((state) => state.reloadScene);
    const [cameraAnchor, setCameraAnchor] = useState(null);
    const [debugAnchor, setDebugAnchor] = useState(null);

    return (
        <Box sx={{ fontSize: "0.875rem" }}>
            <MenuCard sx={{ p: 1 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
                    <GameMenuPrimaryButtonGroup
                        useStore={useStore}
                        type="GameMenu"
                        useRouter={useRouter}
                    />
                </Box>
                <Box sx={{ display: "flex" }}>
                    <ArticlesButton
                        small
                        sx={{ width: "50%" }}
                        startIcon={<CameraAltIcon />}
                        aria-haspopup="menu"
                        aria-expanded={Boolean(cameraAnchor)}
                        onClick={(event) =>
                            setCameraAnchor(event.currentTarget)
                        }
                    >
                        Camera
                    </ArticlesButton>
                    <Menu
                        anchorEl={cameraAnchor}
                        open={Boolean(cameraAnchor)}
                        onClose={() => setCameraAnchor(null)}
                        slotProps={{
                            paper: { sx: { maxHeight: 600, width: 200 } },
                        }}
                    >
                        {["Free", "Player"].map((name) => (
                            <MenuItem
                                key={name}
                                selected={cameraMode === name}
                                onClick={() => {
                                    setCameraMode(name);
                                    setCameraAnchor(null);
                                }}
                            >
                                <ListItemIcon>
                                    <CameraAltIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>{name}</ListItemText>
                            </MenuItem>
                        ))}
                    </Menu>
                    <ArticlesButton
                        small
                        sx={{ width: "50%" }}
                        startIcon={<BugReportIcon />}
                        aria-haspopup="menu"
                        aria-expanded={Boolean(debugAnchor)}
                        onClick={(event) => setDebugAnchor(event.currentTarget)}
                    >
                        Debug {debug ? "On" : "Off"}
                    </ArticlesButton>
                    <Menu
                        anchorEl={debugAnchor}
                        open={Boolean(debugAnchor)}
                        onClose={() => setDebugAnchor(null)}
                        slotProps={{
                            paper: { sx: { maxHeight: 600, width: 200 } },
                        }}
                    >
                        {[false, true].map((value) => (
                            <MenuItem
                                key={String(value)}
                                selected={debug === value}
                                onClick={() => {
                                    setDebug(value);
                                    reloadScene();
                                    setDebugAnchor(null);
                                }}
                            >
                                {value ? "True" : "False"}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </MenuCard>
            <PeerDetails />
            <MenuCard sx={{ p: 2 }}>
                <Box
                    sx={{
                        mb: 0.5,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>Status: {gameState?.status}</Box>
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <AccessTimeIcon fontSize="inherit" />
                        {gameState ? gameState.maxTime - gameState.timer : 0}
                    </Box>
                </Box>
                <ArticlesButton
                    variant="success"
                    fullWidth
                    disabled={gameState?.status !== "In Lobby"}
                    onClick={() => startGame()}
                >
                    Start Game
                </ArticlesButton>
            </MenuCard>
            <Scoreboard />
            <ControllerUICard />
            <DebugControls />
        </Box>
    );
}

export default memo(LeftPanelContent);
