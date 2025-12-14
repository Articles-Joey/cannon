import { useState } from "react";
import { useControllerStore } from "@/hooks/useControllerStore";
import ArticlesButton from "@/components/UI/Button";
import ControllerPreview from "@/components/ControllerPreview";

export default function ControllerUICard({ }) {

    const controllerState = useControllerStore(state => state.controllerState);
    const [showControllerState, setShowControllerState] = useState(false);

    return (
        <>
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
        </>
    )

}
