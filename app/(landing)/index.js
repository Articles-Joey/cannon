"use client"
import { useEffect, useContext, useState } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import ArticlesButton from '@/components/UI/Button';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';

import { GamepadKeyboard, PieMenu } from '@articles-media/articles-gamepad-helper';

import { useGameServer } from '@/hooks/useGameServer';

// const game_key = process.env.NEXT_PUBLIC_GAME_KEY
// const game_name = process.env.NEXT_PUBLIC_GAME_NAME
// const game_port = process.env.NEXT_PUBLIC_GAME_PORT

// const backgroundImage = `img/preview.webp`;
const LandingBackgroundAnimation = dynamic(() =>
    import('@/components/Game/LandingBackgroundAnimation'),
    {
        ssr: false,
        // loading: () => <img
        //     src={backgroundImage.src}
        //     alt=""
        //     // fill
        //     style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
        // />
    }
);

export default function CannonGameLobbyPage() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const darkMode = useStore(state => state.darkMode)

    const toontownMode = useStore(state => state.toontownMode)

    const resetPeerStore = useGameServer(state => state.reset);

    const lobbyDetails = useStore(state => state.lobbyDetails)

    const [joinGame, setJoinGame] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        resetPeerStore();
        setIsMounted(true)
    }, [])

    return (
        <>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                // RotatingMascot={RotatingMascot}
                Link={Link}
                logoImage={`img/icon.png`}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                heroOverride={<>
                    <img
                        src={
                            toontownMode ?
                                "img/toontown-hero.webp"
                                :
                                "img/hero.webp"
                        }
                        alt="Hero Image"
                        className='w-100'
                    />
                </>}
                NicknameInputConfig={{
                    PreComponent:
                        <>
                            <img
                                className='panel-bg me-2'
                                src="img/toontown_icon.webp"
                                width={70}
                                height={70}
                            />
                        </>
                }}
                backgroundImage={
                    toontownMode ?
                        darkMode ?
                            `img/toontown-preview.webp`
                            :
                            `img/toontown-preview.webp`
                        :
                        darkMode ?
                            `img/preview-dark.webp`
                            :
                            `img/preview.webp`
                }
                singlePlayerConfig={{

                }}
                CardBodyOverride={
                    <div className="card-body p-3">
                        {joinGame === false &&
                            <>
                                <Link
                                    href={"/play?server_type=single-player"}
                                >
                                    <ArticlesButton
                                        className="w-100 mb-2"
                                    >
                                        <i className='fas fa-play me-2'></i>
                                        Single Player
                                    </ArticlesButton>
                                </Link>

                                <Link
                                    href={"/play?server_type=online-peer"}
                                >
                                    <ArticlesButton
                                        className="w-100 mb-2"
                                    >
                                        <i className='fas fa-play me-2'></i>
                                        Multiplayer Game
                                    </ArticlesButton>
                                </Link>

                                <ArticlesButton
                                    className="w-100"
                                    onClick={() => {
                                        setJoinGame("")
                                    }}
                                >
                                    <i className='fas fa-users me-2'></i>
                                    Join Game
                                </ArticlesButton>

                                <div
                                    className='d-none'
                                >
                                    <div className="fw-bold mb-1 small text-center">
                                        {lobbyDetails?.players?.length || 0} player{lobbyDetails?.players?.length > 1 && 's'} in the lobby.
                                    </div>

                                    {/* <div className='small fw-bold'>Public Servers</div> */}

                                    <div className="servers">

                                        {[1, 2, 3, 4].map(id => {

                                            let lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(lobby =>
                                                parseInt(lobby.server_id) == id
                                            )

                                            return (
                                                <div key={id} className="server">

                                                    <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                                        <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                                        <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                                    </div>

                                                    <div className='d-flex justify-content-around w-100 mb-1'>
                                                        {[1, 2, 3, 4].map(player_count => {

                                                            let playerLookup = false

                                                            if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                                            return (
                                                                <div key={player_count} className="icon" style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    ...(playerLookup ? {
                                                                        backgroundColor: 'black',
                                                                    } : {
                                                                        backgroundColor: 'gray',
                                                                    }),
                                                                    border: '1px solid black'
                                                                }}>

                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    <Link
                                                        className={``}
                                                        href={{
                                                            pathname: `/play`,
                                                            query: {
                                                                server: id
                                                            }
                                                        }}
                                                    >
                                                        <ArticlesButton
                                                            className="px-5"
                                                            small
                                                        >
                                                            Join
                                                        </ArticlesButton>
                                                    </Link>

                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>

                                {/* <div className='small fw-bold  mt-3 mb-1'>Or</div> */}

                                {/* <div className='d-flex'>
            
                                        <ArticlesButton
                                            className={`w-50`}
                                            onClick={() => {
                                                // TODO
                                                alert("Coming Soon!")
                                            }}
                                        >
                                            <i className="fad fa-robot"></i>
                                            Practice
                                        </ArticlesButton>
            
                                        <ArticlesButton
                                            className={`w-50`}
                                            onClick={() => {
                                                setShowPrivateGameModal(prev => !prev)
                                            }}
                                        >
                                            <i className="fad fa-lock"></i>
                                            Private Game
                                        </ArticlesButton>
            
                                    </div> */}
                            </>
                        }

                        {joinGame !== false &&
                            <>
                                <div className="form-group articles mb-0">
                                    <label htmlFor="nickname">Server ID</label>
                                    {/* <SingleInput
                                        value={nickname}
                                        setValue={setNickname}
                                    /> */}
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="server-id"
                                        value={joinGame}
                                        onChange={(e) => setJoinGame(e.target.value)}
                                    ></input>
                                </div>
                                <div style={{ fontSize: '0.8rem' }}>Enter the 4 digit Server ID</div>

                                <div className='d-flex justify-content-center mt-3'>
                                    <ArticlesButton
                                        className=""
                                        onClick={() => {
                                            setJoinGame(false)
                                        }}
                                    >
                                        <i className="fad fa-arrow-left"></i>
                                        Go Back
                                    </ArticlesButton>
                                    <Link href={{
                                        pathname: "/play",
                                        query: {
                                            server: joinGame
                                        }
                                    }}>
                                        <ArticlesButton
                                            className=""
                                            onClick={() => {
                                                // setJoinGame("")
                                            }}
                                        >
                                            <i className="fad fa-play"></i>
                                            Join Game
                                        </ArticlesButton>
                                    </Link>
                                </div>
                            </>
                        }
                    </div>
                }
                multiplayerConfig={{
                    type: "WebSocket",
                    comingSoon: true,
                    defaultServers: 2,
                    privateServerSupport: false,
                    onlinePlayersTemplate: "2.0",
                }}
                brandingTextClass="jaro-primary"
            // disableGameScoreboard={true}
            />
        </>
    );
}