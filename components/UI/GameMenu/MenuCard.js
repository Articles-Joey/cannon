import Box from "@mui/material/Box";

export default function MenuCard({ sx = [], ...props }) {
    return (
        <Box
            {...props}
            sx={[
                {
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    overflowWrap: "break-word",
                    bgcolor: "background.paper",
                    color: "text.primary",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    ".panel-left &, .menu-bar &": {
                        bgcolor: "transparent",
                        color: "#000",
                        borderRadius: 0,
                    },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        />
    );
}
