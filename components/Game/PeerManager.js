import { useCannonStore } from '@/hooks/useCannonStore';
import { useGameServer } from '@/hooks/useGameServer';
import { useStore } from '@/hooks/useStore';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useEffect } from 'react';

export default function PeerManager() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const nickname = useStore(state => state.nickname);

    // PeerJS Refs
    const connectionsRef = useRef({});

    const peer = useGameServer(state => state.peer)
    const setPeer = useGameServer(state => state.setPeer)
    const isHost = useGameServer(state => state.isHost)
    const setIsHost = useGameServer(state => state.setIsHost)
    // const gameState = useGameServer(state => state.gameState) // Removed to prevent re-renders
    const setGameState = useGameServer(state => state.setGameState)
    const addBannedId = useGameServer(state => state.addBannedId)
    const setDisplayId = useGameServer(state => state.setDisplayId)

    const initializingRef = useRef(false);

    useEffect(() => {

        if (!server && !peer && !initializingRef.current) {
            initializingRef.current = true;
            const initHost = async () => {
                const { default: Peer } = await import('peerjs');
                // Generate 4 character random ID
                const id = Math.random().toString(36).substring(2, 6).toUpperCase();
                const newPeer = new Peer(id);

                newPeer.on('open', (id) => {
                    console.log('Host ID: ' + id);
                    if (!peer) { // Double check to avoid race conditions
                        setPeer(newPeer);
                        setIsHost(true);
                        setDisplayId(id);
                    }
                });

                newPeer.on('connection', (conn) => {

                    if (useGameServer.getState().bannedIds.includes(conn.peer)) {
                        console.log('Rejected banned peer:', conn.peer);
                        conn.close();
                        return;
                    }

                    conn.on('open', () => {
                        console.log('Client connected: ' + conn.peer);
                        connectionsRef.current[conn.peer] = conn;

                        // Assign a spaced-out position to the new player
                        setGameState(prev => {
                            const players = [...(prev.players || [])];
                            const playerCount = players.length; // includes host already
                            const spacing = 4;
                            const offsetX = playerCount * spacing;
                            players.push({
                                id: conn.peer,
                                position: [offsetX, 0, 43],
                                assignedPosition: [offsetX, 0, 43],
                                rotation: [0, Math.PI, 0]
                            });
                            return { ...prev, players };
                        });

                        // New player joined — tell them their assigned position
                        // (will be included in next gameState broadcast)

                        // Tell all existing clients to reload their scene too
                        Object.values(connectionsRef.current).forEach(c => {
                            if (c.open) {
                                c.send({ type: 'reloadScene' });
                            }
                        });
                    });
                    conn.on('data', (msg) => {
                        if (msg.type === 'playerUpdate') {
                            setGameState(prev => {
                                const players = [...(prev.players || [])];
                                const index = players.findIndex(p => p.id === conn.peer);
                                // Only update rotation, action, nickname — NOT position
                                // Position is assigned by the host on join
                                const newPlayerData = {
                                    id: conn.peer,
                                    rotation: msg.data.rotation,
                                    action: msg.data.action,
                                    nickname: msg.data.nickname
                                };

                                if (index > -1) {
                                    players[index] = { ...players[index], ...newPlayerData };
                                } else {
                                    players.push({ ...newPlayerData, position: [0, 0, 43] });
                                }
                                return { ...prev, players };
                            });
                        }
                        if (msg.type === 'fireProjectile') {
                            // Client fired a projectile — add it to local cannon store
                            // so the host simulates physics for it
                            const { addProjectile } = useCannonStore.getState();
                            addProjectile({
                                ...msg.data,
                                ownerId: conn.peer
                            });
                        }
                    });
                    conn.on('close', () => {
                        console.log('Client disconnected: ' + conn.peer);
                        delete connectionsRef.current[conn.peer];
                        setGameState(prev => ({
                            ...prev,
                            players: (prev.players || []).filter(p => p.id !== conn.peer)
                        }));
                    });
                });

                newPeer.on('error', (err) => {
                    console.error('PeerJS Host error:', err);
                });
            };
            initHost();
        }

        if (server && !peer && !initializingRef.current) {
            initializingRef.current = true;
            const initClient = async () => {
                const { default: Peer } = await import('peerjs');
                const id = Math.random().toString(36).substring(2, 6).toUpperCase();
                const newPeer = new Peer(id);

                newPeer.on('open', (id) => {
                    console.log('Client ID: ' + id);
                    if (!peer) {
                        setPeer(newPeer);
                        setIsHost(false);
                        setDisplayId(server);

                        const conn = newPeer.connect(server);
                        conn.on('open', () => {
                            console.log('Connected to Host');
                            connectionsRef.current['host'] = conn;
                        });
                        conn.on('data', (data) => {
                            if (data.type === 'kicked') {
                                console.log('You have been kicked by the host.');
                                conn.close();
                                router.push('/');
                                return;
                            }
                            if (data.type === 'reloadScene') {
                                console.log('Host requested scene reload (new player joined)');
                                reloadSceneRef.current();
                                return;
                            }
                            if (data.type === 'gameState') {
                                setGameState(data.state);
                            }
                        });
                        conn.on('close', () => console.log('Disconnected from Host'));
                        conn.on('error', err => console.error('Connection Error:', err));
                    }
                });

                newPeer.on('error', err => console.error('PeerJS Client Error:', err));
            };
            initClient();
        }

    }, [server, peer, setPeer, setIsHost, setGameState]);

    // const lastTagTime = useRef(0);

    // Network Loop
    useEffect(() => {
        
        if (!peer) return;

        const interval = setInterval(() => {

            const { 
                position: myPosition, 
                playerRotation: myRotation, 
                action: myAction,
                projectiles: localProjectiles
            } = useCannonStore.getState();

            // Get nickname directly to ensure freshness inside interval
            const myNickname = useStore.getState().nickname;
            const myId = peer.id;

            if (isHost) {
                let broadcastState = null;

                // Host: Update self, run tag logic, and broadcast using FUNCTIONAL update
                // to avoid race conditions with incoming client data
                setGameState(prev => {
                    const players = [...(prev.players || [])];
                    let itPlayerId = prev.itPlayerId || myId; // Keep existing IT or default

                    // 1. Update Host Data
                    const index = players.findIndex(p => p.id === myId);
                    const hostPosition = index > -1 && players[index].assignedPosition
                        ? players[index].assignedPosition
                        : [0, 0, 43];
                    const newPlayer = { id: myId, position: hostPosition, assignedPosition: hostPosition, rotation: myRotation, action: myAction, nickname: myNickname };

                    if (index > -1) {
                        players[index] = { ...players[index], ...newPlayer };
                    } else {
                        players.push(newPlayer);
                    }

                    // 2. Tag Logic (Moved inside to use fresh 'players' and 'itPlayerId')
                    // if (Date.now() > lastTagTime.current + 3000) {
                    //     const currentItPlayer = players.find(p => p.id === itPlayerId);

                    //     if (currentItPlayer && currentItPlayer.position) {
                    //         const taggedPlayer = players.find(p => {
                    //             if (p.id === itPlayerId) return false;
                    //             if (!p.position) return false;

                    //             const dx = p.position[0] - currentItPlayer.position[0];
                    //             const dy = p.position[1] - currentItPlayer.position[1];
                    //             const dz = p.position[2] - currentItPlayer.position[2];
                    //             const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    //             return dist < 1.0;
                    //         });

                    //         if (taggedPlayer) {
                    //             console.log(`Tag Event! ${itPlayerId} tagged ${taggedPlayer.id}`);
                    //             itPlayerId = taggedPlayer.id;
                    //             lastTagTime.current = Date.now();
                    //         }
                    //     } else {
                    //         if (!currentItPlayer && players.length > 0) {
                    //             console.log("IT player lost, resetting to Host");
                    //             itPlayerId = myId;
                    //         }
                    //     }
                    // }

                    // 3. Construct New State (include projectiles from local physics)
                    const newState = { ...prev, players, itPlayerId, projectiles: localProjectiles };

                    // Capture for broadcast
                    broadcastState = newState;

                    return newState;
                });

                // Broadcast the state we just calculated
                if (broadcastState) {
                    Object.values(connectionsRef.current).forEach(conn => {
                        if (conn.open) {
                            conn.send({ type: 'gameState', state: broadcastState });
                        }
                    });
                }

            } else {
                // Client: Send position + rotation to host
                const hostConn = connectionsRef.current['host'];
                if (hostConn && hostConn.open) {
                    hostConn.send({
                        type: 'playerUpdate',
                        data: { position: myPosition, rotation: myRotation, action: myAction, nickname: myNickname }
                    });
                }

                // Client: Sync server projectiles to local store for rendering
                const serverProjectiles = useGameServer.getState().gameState.projectiles || [];
                useCannonStore.getState().setProjectiles(serverProjectiles);

                // Sync local position from server-assigned position
                const myPlayerData = useGameServer.getState().gameState.players?.find(p => p.id === peer.id);
                if (myPlayerData?.assignedPosition) {
                    useCannonStore.getState().setPosition(myPlayerData.assignedPosition);
                }
            }
        }, 50);

        return () => clearInterval(interval);
    }, [peer, isHost, setGameState]);

    return (
        <></>
    )
}