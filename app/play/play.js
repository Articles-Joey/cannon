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
import PeerManager from '@/components/Game/PeerManager';
import { Suspense } from 'react';
import { useGameServer } from '@/hooks/useGameServer';

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

    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

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

    const [players, setPlayers] = useState([])

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

    const [gameState, setGameState] = useState(false)

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

            <Suspense>
                <PeerManager />
            </Suspense>

            <div className="menu-bar card card-articles rounded-0 p-1 justify-content-center">

                <div className='d-flex justify-content-center align-items-center'>

                    <ArticlesButton
                        small
                        active={showMenu}
                        className="px-4"
                        onClick={() => {
                            setShowMenu(!showMenu)
                        }}
                    >
                        <i className="fad fa-bars"></i>
                        <span>Menu</span>
                    </ArticlesButton>
                    <ArticlesButton
                        small
                        // active={showMenu}
                        className=""
                        onClick={() => {
                            setShowSettingsModal(true)
                        }}
                    >
                        <i className="fad fa-cog"></i>
                    </ArticlesButton>

                    <div>
                        {/* Y: {(playerLocation?.y || 0)} */}
                    </div>

                </div>

            </div>

            <div className={`mobile-menu ${showMenu && 'show'}`}>
                <LeftPanelContent
                    {...panelProps}
                />
            </div>

            <TouchControls
            // touchControlsEnabled={touchControlsEnabled}
            />

            <div className='panel-left '>

                <LeftPanelContent
                    {...panelProps}
                />

            </div>

            {/* <div className='game-info'>
                <div className="card card-articles card-sm">
                    <div className="card-body">
                        <pre> 
                            {JSON.stringify(playerData, undefined, 2)}
                        </pre>
                    </div>
                </div>
            </div> */}

            <ControlsOverlay />

            <div className='canvas-wrap'>

                <GameCanvas
                    key={sceneKey}
                    gameState={gameState}
                    // playerData={playerData}
                    // setPlayerData={setPlayerData}
                    players={players}
                />

            </div>

        </div>
    );
}