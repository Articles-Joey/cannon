import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import AppThemeProvider from "@/components/AppThemeProvider";
import "@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css";

import SocketLogicHandler from "@/components/Handlers/SocketLogicHandler";
import AudioHandler from "@/components/Handlers/AudioHandler";
import SinglePlayerHandler from "@/components/Handlers/SinglePlayerHandler";
import PeerHandler from "@/components/Handlers/PeerHandler";
import LayoutClient from "./layout-client";

export const metadata = {
    title: "Cannon Game",
    description:
        "Shoot your way to the top by landing your shots in the water tower!",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <AppThemeProvider>
                        <LayoutClient />
                        <Suspense>
                            <SocketLogicHandler />
                            <AudioHandler />
                            <PeerHandler />
                            <SinglePlayerHandler />
                        </Suspense>
                        {children}
                    </AppThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
