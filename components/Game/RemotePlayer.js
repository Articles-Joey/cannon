import Duck from "@/components/Models/Duck";
import { Cannon } from "@/components/Models/Cannon";
import { degToRad } from "three/src/math/MathUtils";

const PLAYER_SPACING = 4; // units apart along X axis

export default function RemotePlayer({ player, index = 0, totalPlayers = 1 }) {

    // Spread players in a line centered on X=0 at Z=43
    // const offsetX = (index - (totalPlayers - 1) / 2) * PLAYER_SPACING;
    const position = player?.position;
    const rotation = player?.rotation || [0, degToRad(180), 0];

    return (
        <>
            <group position={position}>
                <group rotation={[0, rotation[1], 0]} scale={3}>
                    <Cannon
                        rotation={[rotation[0], 0, 0]}
                    />
                </group>
                <Duck
                    position={[0, 0, 5]}
                    rotation={[0, -Math.PI / 2, 0]}
                    scale={1}
                />
            </group>
        </>
    )
}