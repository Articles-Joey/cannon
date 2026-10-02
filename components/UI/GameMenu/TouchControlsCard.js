import MenuCard from "./MenuCard";
import Box from "@mui/material/Box";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import BlockIcon from "@mui/icons-material/Block";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import ArticlesButton from "@/components/UI/Button";

export default function TouchControlsCard() {
    const enabled = useTouchControlsStore((state) => state.enabled);
    const setEnabled = useTouchControlsStore((state) => state.setEnabled);

    return (
        <MenuCard sx={{ p: 1 }}>
            <Box sx={{ fontSize: "0.875em", opacity: 0.75 }}>
                Touch Controls
            </Box>
            <Box sx={{ display: "flex" }}>
                <ArticlesButton
                    small
                    sx={{ width: "50%" }}
                    active={!enabled}
                    onClick={() => setEnabled(false)}
                    startIcon={<BlockIcon />}
                >
                    Off
                </ArticlesButton>
                <ArticlesButton
                    small
                    sx={{ width: "50%" }}
                    active={enabled}
                    onClick={() => setEnabled(true)}
                    startIcon={<TouchAppIcon />}
                >
                    On
                </ArticlesButton>
            </Box>
        </MenuCard>
    );
}
