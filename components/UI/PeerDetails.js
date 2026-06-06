
import { useGameServer } from '@/hooks/useGameServer';
import ArticlesButton from './Button';
import { useGameStore } from '@/hooks/useGameStore';

export default function PeerDetails({ kickPlayer }) {

    const peer = useGameServer(state => state.peer)
    const isHost = useGameServer(state => state.isHost)
    const displayId = useGameServer(state => state.displayId)

    // const gameState = useGameServer(state => state.gameState)

    if (!peer) return null;

    if (!displayId) return null;

    return (
        <div className="card card-articles card-sm">
            <div className="card-body">

                <div className="small text-muted">
                    Multiplayer Peer Info
                </div>

                <div className="d-flex justify-content-between align-items-center border p-1">

                    <div>

                        <ArticlesButton
                            className={`me-2`}
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.origin + "/play?server=" + displayId
                                )
                            }}
                        >
                            <i className="fad fa-clipboard me-0"></i>
                        </ArticlesButton>

                        <span>ID: <span className="fw-bold h5 mb-0 text-primary">{displayId}</span></span>

                    </div>

                    {isHost && <span className="badge bg-success">HOST</span>}

                </div>

                <div
                    className="text-muted mt-1"
                    style={{
                        fontSize: "0.8rem"
                    }}
                >
                    Share this ID with friends to play together! Clipboard button copies the invite link.
                </div>
                
            </div>
        </div>
    )
}