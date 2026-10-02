"use client";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import useFullscreen from "@articles-media/articles-dev-box/useFullscreen";
import GameMenu from "@articles-media/articles-dev-box/GameMenu";
import LeftPanelContent from "@/components/UI/GameMenu";
import { useCannonStore } from "@/hooks/useCannonStore";
import generateRandomInteger from "@/util/generateRandomInteger";
import ControlsOverlay from "@/components/Game/ControlsOverlay";
import TouchControls from "@/components/UI/TouchControls";
import classNames from "classnames";
import { useStore } from "@/hooks/useStore";
import TimerOverlay from "@/components/UI/TimerOverlay";
import GameOverOverlay from "@/components/UI/GameOverOverlay";

const GameCanvas = dynamic(() => import("@/components/Game/GameCanvas"), {
    ssr: false,
});

export default function CannonGamePage() {
    const sidebar = useStore((state) => state.sidebar);
    const showMenu = useStore((state) => state.showMenu);
    const sceneKey = useStore((state) => state.sceneKey);
    const resetPlayerRotation = useCannonStore(
        (state) => state.resetPlayerRotation,
    );
    const setGoalLocation = useCannonStore((state) => state.setGoalLocation);
    const { isFullscreen } = useFullscreen();

    useEffect(() => {
        resetPlayerRotation();
        setGoalLocation([
            generateRandomInteger(-10, 10),
            0,
            generateRandomInteger(-10, 10),
        ]);
    }, [resetPlayerRotation, setGoalLocation]);

    return (
        <Box
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    "menu-open": showMenu,
                    fullscreen: isFullscreen,
                    "show-sidebar": sidebar,
                },
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={(theme) => ({
                position: "relative",
                display: "flex",
                overflow: "hidden",
                "--toontown-bg-color":
                    theme.palette.mode === "dark" ? "#a0a56c" : "#faffc7",
                "--toontown-green-color":
                    theme.palette.mode === "dark" ? "#005300" : "#019f02",
                // These elements belong to dev-box; keep Cannon's custom skin scoped to this page.
                "& .panel-left, & .menu-bar": {
                    bgcolor: "var(--toontown-bg-color)",
                    color: "#000",
                    border: "2px solid var(--toontown-green-color)",
                    borderRadius: "10px",
                    "--articles-button-background-color": "#ffd351",
                    "--articles-button-color": "#000",
                    "--articles-card-font-color": "#000",
                    "--articles-card-background-color": "transparent",
                },
                "& .panel-left": { borderWidth: "10px" },
                "& .menu-bar": {
                    width: "calc(100% - 20px)",
                    left: "10px",
                    bottom: "10px",
                },
                "& .mobile-menu": { bgcolor: "rgba(255, 0, 0, 0.8)" },
            })}
        >
            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Bar",
                    menuBarButtonPosition: "Left",
                    settingsWithMenuButton: true,
                }}
                sidebarConfig={{ style: "Floating Panel" }}
            />
            <Box
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    "& canvas": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        left: 0,
                        top: 0,
                    },
                }}
            >
                <TouchControls />
                <ControlsOverlay />
                <TimerOverlay />
                <GameOverOverlay />
                <GameCanvas key={sceneKey} />
            </Box>
        </Box>
    );
}
