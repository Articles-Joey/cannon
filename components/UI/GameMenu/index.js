import Link from "next/link";

import { memo } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Dropdown, DropdownButton } from "react-bootstrap";

// import ROUTES from '@/components/constants/routes';
// import { useGameStore } from "../hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useCannonStore } from "@/hooks/useCannonStore";
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import { useStore } from "@/hooks/useStore";

import DebugControls from "./DebugControls";
import TouchControlsCard from "./TouchControlsCard";
import ControllerUICard from "./ControllerUICard";
import Scoreboard from "./Scoreboard";
import PeerDetails from "../PeerDetails";

function LeftPanelContent({ }) {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server_type } = searchParamsObject

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const setDebug = useCannonStore(state => state.setDebug);
    const debug = useCannonStore(state => state.debug);
    const cameraMode = useCannonStore(state => state.cameraMode);
    const setCameraMode = useCannonStore(state => state.setCameraMode);

    const reloadScene = useStore(state => state.reloadScene);

    // const darkMode = useStore(state => state.darkMode);
    // const toggleDarkMode = useStore(state => state.toggleDarkMode);

    // const setShowSettingsModal = useStore(state => state.setShowSettingsModal);

    // const sidebar = useStore(state => state.sidebar);
    // const toggleSidebar = useStore(state => state.toggleSidebar);

    // const setShowMenu = useStore(state => state.setShowMenu);

    // const toggleAudioEnabled = useStore((state) => state.toggleAudioEnabled)
    // const audioEnabled = useStore((state) => state.audioSettings.enabled)

    return (
        <div className='mobile-menu-container'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    {/* {
                        (
                            server_type.includes("socket")
                            &&
                            !socket?.connected
                        )
                        &&
                        <div
                            className=""
                        >

                            <div className='flex-header'>
                                <div>Server: {server}</div>
                                <div>Players: {0}/4</div>
                            </div>

                            <div className="">

                                <div className="h6 mb-1">Not connected</div>

                                <ArticlesButton
                                    onClick={() => {
                                        console.log("Reconnect")
                                        socket.connect()
                                    }}
                                    small
                                    className='w-100 mb-3'
                                >
                                    Reconnect!
                                </ArticlesButton>

                            </div>

                        </div>
                    } */}

                    <div className="">

                        <div className='d-flex flex-wrap mb-3'>
                            <GameMenuPrimaryButtonGroup
                                useStore={useStore}
                                type="GameMenu"
                                useRouter={useRouter}
                            />
                        </div>

                        <div className="d-flex flex-wrap">

                            <div className='w-50'>
                                <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-camera"></i>
                                            <span>Camera</span>
                                        </span>
                                    }
                                >
    
                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>
    
                                        {[
                                            {
                                                name: 'Free',
                                            },
                                            {
                                                name: 'Player',
                                            }
                                        ]
                                            .map(location =>
                                                <Dropdown.Item
                                                    key={location.name}
                                                    active={cameraMode == location.name}
                                                    onClick={() => {
                                                        setCameraMode(location.name)
                                                        // setShowMenu(false)
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    <i className="fad fa-camera"></i>
                                                    {location.name}
                                                </Dropdown.Item>
                                            )}
    
                                    </div>
    
                                </DropdownButton>
                            </div>
    
                            <div className='w-50'>
                                <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-bug"></i>
                                            <span>Debug </span>
                                            <span>{debug ? 'On' : 'Off'}</span>
                                        </span>
                                    }
                                >
    
                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>
    
                                        {[
                                            false,
                                            true
                                        ]
                                            .map(location =>
                                                <Dropdown.Item
                                                    key={location}
                                                    onClick={() => {
                                                        setDebug(location)
                                                        reloadScene()
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    {location ? 'True' : 'False'}
                                                </Dropdown.Item>
                                            )}
    
                                    </div>
    
                                </DropdownButton>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

            {/* <div
                className="card card-articles card-sm"
            >
                <div className="card-body d-flex justify-content-between">

                    <div>
                        <div className="small text-muted">playerData</div>
                        <div className="small">
                            <div>X: {playerLocation?.x}</div>
                            <div>Y: {playerLocation?.y}</div>
                            <div>Z: {playerLocation?.z}</div>
                            <div>Shift: {shift ? 'True' : 'False'}</div>
                            <div>Score: 0</div>
                        </div>
                    </div>

                    <div>
                        <div className="small text-muted">maxHeight</div>
                        <div>Y: {maxHeight}</div>
                        <ArticlesButton
                            small
                            onClick={() => {
                                setMaxHeight(playerLocation?.y)
                            }}
                        >
                            Reset
                        </ArticlesButton>
                    </div>

                </div>
            </div> */}

            <PeerDetails />

            <Scoreboard />

            {/* Touch Controls */}
            {/* <TouchControlsCard /> */}

            <ControllerUICard />

            <DebugControls />

        </div>
    )

}

export default memo(LeftPanelContent)





