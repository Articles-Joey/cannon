import { useGameStore } from '@/hooks/useGameStore';
import PlayersRing from './PlayersRing';
import RemotePlayer from './RemotePlayer';
import { useGameServer } from '@/hooks/useGameServer';

export default function Players() {

    const gameState = useGameStore(state => state.gameState);
    // const peer = useGameServer(state => state.peer);

    // const otherPlayers = useMemo(() => {
    //     if (!gameState?.players || !peer?.id) return [];
    //     return gameState.players.filter(p => p.id !== peer.id).filter(p => p.position);
    // }, [gameState?.players, peer?.id]);

    const playerCount = gameState?.players?.length || 0;

    return (
        <group>

            <PlayersRing 
                position={[0, 0.02, 0]}
            />

            <group position={[0, 0.04, 0]}>
                {gameState?.players.map((player, index) => (
                    <RemotePlayer
                        key={player.id}
                        player={player}
                        index={index}
                        totalPlayers={playerCount}
                    />
                ))}
            </group>

        </group>
    )
}