"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic'

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@/hooks/useFullScreen';
import { useControllerStore } from '@/hooks/useControllerStore';

import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';

// import LeftPanelContent from '@/components/UI/LeftPanel';
import LeftPanelContent from '@/components/Game/LeftPanel';

import { useSocketStore } from '@/hooks/useSocketStore';
import { useCannonStore } from '@/hooks/useCannonStore';
import generateRandomInteger from '@/util/generateRandomInteger';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function CannonGamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    const {
        playerRotation,
        setPlayerRotation,
        setProjectiles,
        projectiles,
        resetPlayerRotation,
        setGoalLocation,
    } = useCannonStore(state => ({
        playerRotation: state.playerRotation,
        setPlayerRotation: state.setPlayerRotation,
        setProjectiles: state.setProjectiles,
        projectiles: state.projectiles,
        resetPlayerRotation: state.resetPlayerRotation,
        setGoalLocation: state.setGoalLocation,
    }));

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const { controllerState, setControllerState } = useControllerStore()
    const [showControllerState, setShowControllerState] = useState(false)

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

        resetPlayerRotation()
        setGoalLocation([
            generateRandomInteger(-10, 10),
            0,
            generateRandomInteger(-10, 10)
        ])

    }, []);

    const [showMenu, setShowMenu] = useState(false)

    const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    const [sceneKey, setSceneKey] = useState(0);

    const [gameState, setGameState] = useState(false)

    // Function to handle scene reload
    const reloadScene = () => {
        resetPlayerRotation()
        setGoalLocation([
            generateRandomInteger(-10, 10),
            0,
            generateRandomInteger(-10, 10)
        ])
        setSceneKey((prevKey) => prevKey + 1);
    };

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    let panelProps = {
        server,
        players,
        touchControlsEnabled,
        setTouchControlsEnabled,
        reloadScene,
        // controllerState,
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        setShowMenu
    }

    const game_name = 'Cannon'
    const game_key = 'cannon'

    return (

        <div
            className={`cannon-game-page ${isFullscreen && 'fullscreen'}`}
            id="cannon-game-page"
        >

            <div className="menu-bar card card-articles p-1 justify-content-center">

                <div className='flex-header align-items-center'>

                    <ArticlesButton
                        small
                        active={showMenu}
                        onClick={() => {
                            setShowMenu(prev => !prev)
                        }}
                    >
                        <i className="fad fa-bars"></i>
                        <span>Menu</span>
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

            {/* <TouchControls
                touchControlsEnabled={touchControlsEnabled}
            /> */}

            <div className='panel-left card rounded-0 d-none d-lg-flex'>

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

            <div className="controls-overlay">

                <ArticlesButton
                    // small
                    className="fire-button"
                    onClick={() => {
                        console.log("FIRE!")
                        setProjectiles([
                            ...projectiles,
                            {
                                player: 1,
                                id: Math.random()
                            }
                        ])
                    }}
                >
                    <i className="fad fa-fire-alt me-0"></i>
                </ArticlesButton>

                {['up', 'down', 'left', 'right'].map(dir =>
                    <ArticlesButton
                        key={dir}
                        className={`${dir}-button`}
                        onClick={() => {

                            if (['up', 'down'].includes(dir)) {

                                console.log(dir)

                                let newAngle = playerRotation[0]

                                dir == 'up' ?
                                    newAngle -= 0.1
                                    :
                                    newAngle += 0.1

                                setPlayerRotation([
                                    newAngle,
                                    playerRotation[1],
                                    playerRotation[2]
                                ])

                            }

                            if (['left', 'right'].includes(dir)) {

                                console.log(dir)

                                let newAngle = playerRotation[1]

                                dir == 'right' ?
                                    newAngle -= 0.1
                                    :
                                    newAngle += 0.1

                                setPlayerRotation([
                                    playerRotation[0],
                                    newAngle,
                                    playerRotation[2]
                                ])

                            }

                        }}
                    >
                        <i className={`fad fa-chevron-circle-${dir} me-0`}></i>
                    </ArticlesButton>
                )}

            </div>

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