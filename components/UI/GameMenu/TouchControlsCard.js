import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import ArticlesButton from "@/components/UI/Button";

export default function TouchControlsCard({ }) {

    const touchControlsEnabled = useTouchControlsStore(state => state.enabled)
    const setTouchControlsEnabled = useTouchControlsStore(state => state.setEnabled)

    return (
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
    )
}
