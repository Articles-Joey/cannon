import { useCannonStore } from "@/hooks/useCannonStore";
import ArticlesButton from "@/components/UI/Button";

export default function DebugControls({
    reloadScene
}) {

    const projectiles = useCannonStore(state => state.projectiles);
    const playerRotation = useCannonStore(state => state.playerRotation);
    const setProjectiles = useCannonStore(state => state.setProjectiles);

    const cameraFollowsProjectile = useCannonStore(state => state.cameraFollowsProjectile);
    const setCameraFollowsProjectile = useCannonStore(state => state.setCameraFollowsProjectile);

    const setChangeCameraLocation = useCannonStore(state => state.setChangeCameraLocation);

    const setRandomGoalLocation = useCannonStore(state => state.setRandomGoalLocation);

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
                                onClick={() => {
                                    setChangeCameraLocation([
                                        0,
                                        10,
                                        80
                                    ])
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Reset Camera
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={() => {
                                    setRandomGoalLocation()
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Random Tower
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
