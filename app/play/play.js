"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic'

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

// import { useControllerStore } from '@/hooks/useControllerStore';
// import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';

// import LeftPanelContent from '@/components/UI/LeftPanel';
import LeftPanelContent from '@/components/UI/GameMenu';

import { useSocketStore } from '@/hooks/useSocketStore';
import { useCannonStore } from '@/hooks/useCannonStore';
import generateRandomInteger from '@/util/generateRandomInteger';
import ControlsOverlay from '@/components/Game/ControlsOverlay';
import TouchControls from '@/components/UI/TouchControls';
import classNames from 'classnames';
import { useStore } from '@/hooks/useStore';
// import PeerManager from '@/components/Game/PeerManager';
// import { Suspense } from 'react';
// import { useGameServer } from '@/hooks/useGameServer';
import GameMenu from '@articles-media/articles-dev-box/GameMenu';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function CannonGamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    const sidebar = useStore(state => state.sidebar);

    // const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const resetPlayerRotation = useCannonStore(state => state.resetPlayerRotation);
    const setGoalLocation = useCannonStore(state => state.setGoalLocation);

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    // const { controllerState, setControllerState } = useControllerStore()
    // const [showControllerState, setShowControllerState] = useState(false)

    // const [ cameraMode, setCameraMode ] = useState('Player')

    // const [players, setPlayers] = useState([])

    useEffect(() => {

        if (server && socket.connected) {
            socket.emit('join-room', `game:cannon-room-${server}`, {
                game_id: server,
                nickname: JSON.parse(localStorage.getItem('game:nickname')),
                client_version: '1',

            });
        }

        // return function cleanup() {
        //     socket.emit('leave-room', 'game:glass-ceiling-landing')
        // };

    }, [server, socket.connected]);

    useEffect(() => {

        // resetPeerStore();
        resetPlayerRotation()
        setGoalLocation([
            generateRandomInteger(-10, 10),
            0,
            generateRandomInteger(-10, 10)
        ])

    }, []);

    const showMenu = useStore(state => state.showMenu);
    const setShowMenu = useStore(state => state.setShowMenu);
    const reloadScene = useStore(state => state.reloadScene)
    const sceneKey = useStore(state => state.sceneKey)

    // const [gameState, setGameState] = useState(false)

    return (

        <div
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': showMenu,
                    'fullscreen': useFullscreen().isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
        >

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Bar",
                    menuBarButtonPosition: "Left",
                    settingsWithMenuButton: true,
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <div className='canvas-wrap'>

                <TouchControls />

                <ControlsOverlay />

                <GameCanvas
                    key={sceneKey}
                    // gameState={gameState}
                    // playerData={playerData}
                    // setPlayerData={setPlayerData}
                    // players={players}
                />

            </div>

        </div>
    );
}