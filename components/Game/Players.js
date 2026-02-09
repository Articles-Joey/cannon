import RemotePlayer from './RemotePlayer';
import { useGameServer } from '@/hooks/useGameServer';

export default function Players() {

    const gameState = useGameServer(state => state.gameState);
    const peer = useGameServer(state => state.peer);

    // const otherPlayers = useMemo(() => {
    //     if (!gameState?.players || !peer?.id) return [];
    //     return gameState.players.filter(p => p.id !== peer.id).filter(p => p.position);
    // }, [gameState?.players, peer?.id]);

    const playerCount = gameState?.players?.length || 0;

    return (
        <>
            {gameState?.players.map((player, index) => (
                <RemotePlayer
                    key={player.id}
                    player={player}
                    index={index}
                    totalPlayers={playerCount}
                />
            ))}
        </>
    )
}