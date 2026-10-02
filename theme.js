"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { bootstrapCompatibilityTheme } from "@articles-media/articles-dev-box/bootstrapCompatibilityTheme";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export function createAppTheme(mode = "dark") {
    return createTheme({
        cssVariables: true,
        palette: { mode, primary: { main: "#f9edcd" } },
        typography: { fontFamily: roboto.style.fontFamily },
        components: {
            MuiAlert: {
                styleOverrides: {
                    root: {
                        variants: [
                            {
                                props: { severity: "info" },
                                style: { backgroundColor: "#60a5fa" },
                            },
                        ],
                    },
                },
            },
            MuiCssBaseline: {
                styleOverrides: (muiTheme) => ({
                    ...bootstrapCompatibilityTheme.MuiCssBaseline.styleOverrides(
                        muiTheme,
                    ),
                    "@font-face": {
                        fontFamily: "Minnie",
                        src: 'url("/fonts/Minnie.ttf") format("truetype")',
                        fontWeight: "normal",
                        fontStyle: "normal",
                        fontDisplay: "swap",
                    },
                    button: { fontSize: "0.75rem !important" },
                    ".stats-overlay": {
                        position: "fixed",
                        top: 0,
                        right: "0 !important",
                        left: "initial !important",
                        zIndex: 4,
                    },
                }),
            },
        },
    });
}

export default createAppTheme();
