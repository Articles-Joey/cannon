
import { useGameServer } from '@/hooks/useGameServer';
import ArticlesButton from './Button';

export default function PeerDetails({ kickPlayer }) {

    const peer = useGameServer(state => state.peer)
    const isHost = useGameServer(state => state.isHost)
    const displayId = useGameServer(state => state.displayId)
    const gameState = useGameServer(state => state.gameState)

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

                <div className="border mt-3">
                    <div className="border small text-muted mb-1">Players ({gameState?.players?.length || 0})</div>
                    <div className="list-group list-group-flush small">
                        {gameState?.players?.map(player => (
                            <div key={player.id} className="list-group-item px-0 py-1 d-flex justify-content-between align-items-center">
                                <div>
                                    <span className={player.id === peer.id ? "fw-bold" : ""}>
                                        {player.nickname || player.id} {player.id === peer.id ? "(You)" : ""}
                                    </span>
                                    <span className="badge bg-primary ms-2" style={{ fontSize: '0.7em' }}>Player</span>
                                </div>
                                
                                <div className="d-flex align-items-center">
                                    <span className="text-muted font-monospace me-2">
                                        {player.position?.map(c => Math.round(c)).join(', ')}
                                    </span>
                                    {isHost && player.id !== peer.id && (
                                        <button 
                                            className="btn btn-outline-danger btn-sm py-0 px-1 lh-1" 
                                            style={{ fontSize: '0.7rem' }}
                                            onClick={() => kickPlayer && kickPlayer(player.id)}
                                            title="Kick Player"
                                        >
                                            <i className="fad fa-ban"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}