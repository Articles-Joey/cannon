"use client"
import { useEffect, useContext, useState } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import ArticlesButton from '@/components/UI/Button';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import GameScoreboard from '@articles-media/articles-dev-box/GameScoreboard';
import Ad from '@articles-media/articles-dev-box/Ad';
import SessionButton from '@articles-media/articles-dev-box/SessionButton';
import NicknameInput from '@articles-media/articles-dev-box/NicknameInput';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);
import { GamepadKeyboard, PieMenu } from '@articles-media/articles-gamepad-helper';

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';
import { useGameServer } from '@/hooks/useGameServer';

const game_key = process.env.NEXT_PUBLIC_GAME_KEY
const game_name = process.env.NEXT_PUBLIC_GAME_NAME
const game_port = process.env.NEXT_PUBLIC_GAME_PORT

export default function CannonGameLobbyPage() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const darkMode = useStore(state => state.darkMode)
    const toggleDarkMode = useStore(state => state.toggleDarkMode)

    const nickname = useStore(state => state.nickname)
    const _hasHydrated = useStore(state => state._hasHydrated)
    const setNickname = useStore(state => state.setNickname)
    const setRandomNickname = useStore(state => state.setRandomNickname)

    const setShowInfoModal = useStore((state) => state.setShowInfoModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    const resetPeerStore = useGameServer(state => state.reset);

    const lobbyDetails = useStore(state => state.lobbyDetails)
    const setLobbyDetails = useStore(state => state.setLobbyDetails)

    const [joinGame, setJoinGame] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        resetPeerStore();
        setIsMounted(true)
    }, [])

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        game_port
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    return (

        <div className="cannon-landing-page">

            <div className='background-wrap'>
                <div className='filter'></div>
                <img
                    // src={`img/background.webp`}
                    src={
                        darkMode ?
                            `img/background-dark.webp`
                            :
                            `img/background.webp`
                    }
                    alt="Game Background"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                />
            </div>

            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center py-3">

                <div
                    style={{ "width": "20rem" }}
                >

                    <div
                        className="card card-articles card-sm mb-3"
                    >

                        {/* <div style={{ position: 'relative', height: '200px' }}>
                            <Image
                                src={Logo}
                                alt=""
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div> */}

                        <div className='card-header d-flex align-items-center'>

                            <NicknameInput
                                useStore={useStore}
                            />

                        </div>

                        <div className="card-body">

                            {joinGame === false &&
                                <>
                                    <Link
                                        href={"/play?server_type=single-player"}
                                    >
                                        <ArticlesButton
                                            className="w-100 mb-2"
                                        >
                                            <i className='fas fa-play me-2'></i>
                                            Start Game
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

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <GameMenuPrimaryButtonGroup
                                useStore={useStore}
                                type="Landing"
                            />

                        </div>

                    </div>

                    <SessionButton
                        port={game_port}
                        friendsButton={true}
                    />

                    <ReturnToLauncherButton />

                </div>

                <GameScoreboard
                    game={game_name}
                    style="Default"
                    darkMode={darkMode ? true : false}
                />

                <Ad
                    style="Default"
                    section={"Games"}
                    section_id={game_name}
                    darkMode={darkMode ? true : false}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />

            </div>
        </div>
    );
}