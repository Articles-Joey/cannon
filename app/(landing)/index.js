"use client";
import { useEffect, useState, Suspense } from "react";
import { Box, TextField } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PaletteIcon from "@mui/icons-material/Palette";
import Link from "next/link";
import dynamic from "next/dynamic";
import ArticlesButton from "@/components/UI/Button";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";
import {
    GamepadKeyboard,
    PieMenu,
} from "@articles-media/articles-gamepad-helper";
import { useGameServer } from "@/hooks/useGameServer";

const LandingBackgroundAnimation = dynamic(
    () => import("@/components/Game/LandingBackgroundAnimation"),
    { ssr: false },
);

export default function CannonGameLobbyPage() {
    const darkMode = useStore((state) => state.darkMode);
    const toontownMode = useStore((state) => state.toontownMode);
    const nicknameKeyboard = useStore((state) => state.nicknameKeyboard);
    const resetPeerStore = useGameServer((state) => state.reset);
    const lobbyDetails = useStore((state) => state.lobbyDetails);
    const [joinGame, setJoinGame] = useState(false);

    useEffect(() => {
        resetPeerStore();
    }, [resetPeerStore]);

    const pieOptions = [
        {
            label: "Settings",
            Icon: SettingsIcon,
            callback: () => useStore.getState().setShowSettingsModal(true),
        },
        {
            label: "Go Back",
            Icon: ArrowBackIcon,
            callback: () => window.history.back(),
        },
        {
            label: "Credits",
            Icon: InfoIcon,
            callback: () => useStore.getState().setShowCreditsModal(true),
        },
        {
            label: "Game Launcher",
            Icon: SportsEsportsIcon,
            callback: () => {
                window.location.href = "https://games.articles.media";
            },
        },
        {
            label: `${darkMode ? "Light" : "Dark"} Mode`,
            Icon: PaletteIcon,
            callback: () => useStore.getState().toggleDarkMode(),
        },
    ];

    return (
        <Box
            sx={{
                "& .landing-page .background-wrap": {
                    position: "fixed",
                    "& img": { filter: "blur(2px)" },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        bgcolor: darkMode
                            ? "rgba(0, 0, 0, 0.25)"
                            : "transparent",
                        pointerEvents: "none",
                    },
                },
                "& .landing-page .ad-wrap": {
                    mt: 2,
                    "@media (min-width: 992px)": {
                        mt: 0,
                        display: "block",
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                    },
                },
            }}
        >
            <Suspense>
                <GamepadKeyboard
                    disableToggle
                    active={nicknameKeyboard}
                    onFinish={(text) => {
                        useStore.getState().setNickname(text);
                        useStore.getState().setNicknameKeyboard(false);
                    }}
                    onCancel={() =>
                        useStore.getState().setNicknameKeyboard(false)
                    }
                />
                <PieMenu
                    options={pieOptions.map(({ label, Icon, callback }) => ({
                        label: (
                            <Box
                                component="span"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <Icon fontSize="small" />
                                {label}
                            </Box>
                        ),
                        callback,
                    }))}
                    onFinish={(event) => event.callback?.()}
                />
            </Suspense>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                Link={Link}
                logoImage="img/icon.png"
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                heroOverride={
                    <Box
                        component="img"
                        src={
                            toontownMode
                                ? "img/toontown-hero.webp"
                                : "img/hero.webp"
                        }
                        alt="Cannon Game"
                        sx={{ width: "100%" }}
                    />
                }
                NicknameInputConfig={{
                    PreComponent: (
                        <Box
                            component="img"
                            src="img/toontown_icon.webp"
                            alt="Toontown"
                            width={70}
                            height={70}
                            sx={{ mr: 1 }}
                        />
                    ),
                }}
                backgroundImage={
                    toontownMode
                        ? "img/toontown-preview.webp"
                        : darkMode
                          ? "img/previews/dark.webp"
                          : "img/previews/preview.webp"
                }
                singlePlayerConfig={{ attachServerType: "single-player" }}
                CardBodyOverride={
                    <Box sx={{ p: 2 }}>
                        {joinGame === false ? (
                            <>
                                <ArticlesButton
                                    component={Link}
                                    href="/play?server_type=single-player"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                    startIcon={<PlayArrowIcon />}
                                >
                                    Single Player
                                </ArticlesButton>
                                <ArticlesButton
                                    component={Link}
                                    href="/play?server_type=online-peer"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                    startIcon={<PlayArrowIcon />}
                                >
                                    Multiplayer Game
                                </ArticlesButton>
                                <ArticlesButton
                                    fullWidth
                                    onClick={() => setJoinGame("")}
                                    startIcon={<GroupsIcon />}
                                >
                                    Join Game
                                </ArticlesButton>
                                <Box sx={{ display: "none" }}>
                                    <Box
                                        sx={{
                                            fontWeight: 700,
                                            mb: 0.5,
                                            fontSize: "0.875em",
                                            textAlign: "center",
                                        }}
                                    >
                                        {lobbyDetails?.players?.length || 0}{" "}
                                        player
                                        {lobbyDetails?.players?.length > 1 &&
                                            "s"}{" "}
                                        in the lobby.
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gap: "5px",
                                            gridTemplateColumns:
                                                "repeat(2, 1fr)",
                                        }}
                                    >
                                        {[1, 2, 3, 4].map((id) => {
                                            const lobby =
                                                lobbyDetails?.fourFrogsGlobalState?.games?.find(
                                                    (item) =>
                                                        parseInt(
                                                            item.server_id,
                                                        ) === id,
                                                );
                                            return (
                                                <Box
                                                    key={id}
                                                    sx={{
                                                        p: 1,
                                                        border: "1px solid rgba(0, 0, 0, 0.25)",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                            width: "100%",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                fontSize:
                                                                    "0.9rem",
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            Server {id}
                                                        </Box>
                                                        <Box>
                                                            {lobby?.players
                                                                ?.length || 0}
                                                            /4
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-around",
                                                            width: "100%",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {[1, 2, 3, 4].map(
                                                            (count) => (
                                                                <Box
                                                                    key={count}
                                                                    sx={{
                                                                        width: 20,
                                                                        height: 20,
                                                                        bgcolor:
                                                                            lobby
                                                                                ?.players
                                                                                ?.length >=
                                                                            count
                                                                                ? "black"
                                                                                : "gray",
                                                                        border: "1px solid black",
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                    </Box>
                                                    <ArticlesButton
                                                        component={Link}
                                                        href={{
                                                            pathname: "/play",
                                                            query: {
                                                                server: id,
                                                            },
                                                        }}
                                                        sx={{ px: "3rem" }}
                                                        small
                                                    >
                                                        Join
                                                    </ArticlesButton>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <>
                                <TextField
                                    fullWidth
                                    label="Server ID"
                                    id="server-id"
                                    value={joinGame}
                                    onChange={(event) =>
                                        setJoinGame(event.target.value)
                                    }
                                    helperText="Enter the 4 digit Server ID"
                                    size="small"
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 2,
                                    }}
                                >
                                    <ArticlesButton
                                        onClick={() => setJoinGame(false)}
                                        startIcon={<ArrowBackIcon />}
                                    >
                                        Go Back
                                    </ArticlesButton>
                                    <ArticlesButton
                                        component={Link}
                                        href={{
                                            pathname: "/play",
                                            query: { server: joinGame },
                                        }}
                                        startIcon={<PlayArrowIcon />}
                                    >
                                        Join Game
                                    </ArticlesButton>
                                </Box>
                            </>
                        )}
                    </Box>
                }
                multiplayerConfig={{
                    type: "WebSocket",
                    comingSoon: true,
                    defaultServers: 2,
                    privateServerSupport: false,
                    onlinePlayersTemplate: "2.0",
                }}
                brandingTextClass="jaro-primary"
            />
        </Box>
    );
}
