import MenuCard from "./MenuCard";
import Box from "@mui/material/Box";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useCannonStore } from "@/hooks/useCannonStore";
import ArticlesButton from "@/components/UI/Button";
import { useStore } from "@/hooks/useStore";

export default function DebugControls() {
    const projectiles = useCannonStore((state) => state.projectiles);
    const playerRotation = useCannonStore((state) => state.playerRotation);
    const setProjectiles = useCannonStore((state) => state.setProjectiles);
    const cameraFollowsProjectile = useCannonStore(
        (state) => state.cameraFollowsProjectile,
    );
    const setCameraFollowsProjectile = useCannonStore(
        (state) => state.setCameraFollowsProjectile,
    );
    const setChangeCameraLocation = useCannonStore(
        (state) => state.setChangeCameraLocation,
    );
    const setRandomGoalLocation = useCannonStore(
        (state) => state.setRandomGoalLocation,
    );
    const reloadScene = useStore((state) => state.reloadScene);

    return (
        <MenuCard sx={{ p: 1 }}>
            <Box sx={{ fontSize: "0.875em" }}>Debug Controls</Box>
            <Box sx={{ fontSize: "0.875em" }}>
                {playerRotation?.[0]?.toFixed(2)},{" "}
                {playerRotation?.[1]?.toFixed(2)},{" "}
                {playerRotation?.[2]?.toFixed(2)}
            </Box>
            <Box sx={{ py: 1 }}>Projectiles: {projectiles?.length || 0}</Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    "& .MuiButton-root": {
                        fontSize: "0.6rem !important",
                        p: "0.35rem 0.5rem",
                    },
                }}
            >
                <ArticlesButton small onClick={() => setProjectiles([])}>
                    Reset Projectiles
                </ArticlesButton>
                <ArticlesButton
                    small
                    onClick={reloadScene}
                    startIcon={<RestartAltIcon />}
                >
                    Reload Game
                </ArticlesButton>
                <ArticlesButton
                    small
                    onClick={() => setChangeCameraLocation([0, 10, 80])}
                    startIcon={<RestartAltIcon />}
                >
                    Reset Camera
                </ArticlesButton>
                <ArticlesButton small startIcon={<RestartAltIcon />}>
                    Reset Location
                </ArticlesButton>
                <ArticlesButton
                    small
                    onClick={setRandomGoalLocation}
                    startIcon={<RestartAltIcon />}
                >
                    Random Tower
                </ArticlesButton>
                <ArticlesButton
                    small
                    onClick={() =>
                        setCameraFollowsProjectile(!cameraFollowsProjectile)
                    }
                    active={cameraFollowsProjectile}
                >
                    Follow Projectile
                </ArticlesButton>
            </Box>
        </MenuCard>
    );
}
