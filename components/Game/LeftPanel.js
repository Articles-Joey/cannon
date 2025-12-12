import Link from "next/link";

import { memo } from "react";

import { useSearchParams } from "next/navigation";

import { Dropdown, DropdownButton } from "react-bootstrap";

// import ROUTES from '@/components/constants/routes';
// import { useGameStore } from "../hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

import ControllerPreview from "@/components/ControllerPreview";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useCannonStore } from "@/hooks/useCannonStore";
import useFullscreen from "@/hooks/useFullScreen";
import { useStore } from "@/hooks/useStore";

function LeftPanelContent(props) {

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

    const setShowSettingsModal = useStore(state => state.setShowSettingsModal);
    const sidebar = useStore(state => state.sidebar);
    const toggleSidebar = useStore(state => state.toggleSidebar);

    const {
        server,
        // players,
        touchControlsEnabled,
        setTouchControlsEnabled,
        reloadScene,
        controllerState,
        // isFullscreen,
        // requestFullscreen,
        // exitFullscreen,
        setShowMenu
    } = props;

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    {
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
                    }

                    <div className="d-flex flex-wrap">

                        <Link
                            href={'/'}
                            className='w-50'
                        >
                            <ArticlesButton
                                small
                                className='w-100'
                            >
                                <i className="fad fa-arrow-alt-square-left"></i>
                                <span>Leave Game</span>
                            </ArticlesButton>
                        </Link>

                        <ArticlesButton
                            small
                            className="w-50"
                            active={isFullscreen}
                            onClick={() => {
                                if (isFullscreen) {
                                    exitFullscreen()
                                } else {
                                    requestFullscreen('cannon-game-page')
                                }
                            }}
                        >
                            {isFullscreen && <span>Exit </span>}
                            {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                            <span>Fullscreen</span>
                        </ArticlesButton>

                        <ArticlesButton
                            small
                            className="w-50"
                            active={isFullscreen}
                            onClick={() => {
                                setShowSettingsModal(true)
                            }}
                        >
                            <i className='fad fa-cog'></i>
                            <span>Settings</span>
                        </ArticlesButton>

                        <ArticlesButton
                            small
                            className="w-50"
                            active={sidebar}
                            onClick={() => {
                                toggleSidebar()
                            }}
                        >
                            <i className='fad fa-columns'></i>
                            <span>Sidebar</span>
                        </ArticlesButton>

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

            {/* Touch Controls */}
            <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small text-muted">Touch Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={!touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(false)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Off
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(true)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                On
                            </ArticlesButton>
                        </div>

                    </div>

                </div>
            </div>

            <DebugControls
                reloadScene={reloadScene}
            />

            {controllerState?.connected &&
                <div className="panel-content-group p-0 text-dark">

                    <div className="p-1 border-bottom border-dark">
                        <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                            {controllerState?.id}
                        </div>
                    </div>

                    <div className='p-1'>
                        <ArticlesButton
                            small
                            className="w-100"
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </div>

                    {showControllerState && <div className='p-3'>

                        <ControllerPreview
                            controllerState={controllerState}
                            showJSON={true}
                            showVibrationControls={true}
                            maxHeight={300}
                            showPreview={true}
                        />
                    </div>}

                </div>
            }

        </div>
    )

}

export default memo(LeftPanelContent)

function DebugControls({
    reloadScene
}) {

    const projectiles = useCannonStore(state => state.projectiles);
    const playerRotation = useCannonStore(state => state.playerRotation);
    const setProjectiles = useCannonStore(state => state.setProjectiles);

    const cameraFollowsProjectile = useCannonStore(state => state.cameraFollowsProjectile);
    const setCameraFollowsProjectile = useCannonStore(state => state.setCameraFollowsProjectile);

    return (
        <>
            {/* Debug Controls */}
            <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small text-muted">Debug Controls</div>

                    <div className="py-2">
                        {JSON.stringify(playerRotation, null, 2)}
                    </div>

                    <div className="py-2">
                        {/* {JSON.stringify(projectiles, null, 2)} */}
                        {projectiles?.length || 0}
                    </div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={() => {
                                    setProjectiles([])
                                }}
                            >
                                {/* <i className="fad fa-redo"></i> */}
                                Reset Projectiles
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={reloadScene}
                            >
                                <i className="fad fa-redo"></i>
                                Reload Game
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={reloadScene}
                            >
                                <i className="fad fa-redo"></i>
                                Reset Camera
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={() => {
                                    setCameraFollowsProjectile(!cameraFollowsProjectile)
                                }}
                                active={cameraFollowsProjectile}
                            >
                                {/* <i className="fad fa-redo"></i> */}
                                <span
                                // style={{
                                //     fontSize: '0.52rem',
                                // }}
                                >
                                    Follow Projectile
                                </span>
                            </ArticlesButton>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}