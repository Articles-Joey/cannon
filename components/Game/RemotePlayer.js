import Duck from "@/components/Models/Duck";
import { Cannon } from "@/components/Models/Cannon";
import { degToRad } from "three/src/math/MathUtils";
import { ModelMan } from "../Models/Man";

const PLAYER_SPACING = 4; // units apart along X axis

export default function RemotePlayer({ player, index = 0, totalPlayers = 1 }) {

    // Spread players in a line centered on X=0 at Z=43
    // const offsetX = (index - (totalPlayers - 1) / 2) * PLAYER_SPACING;
    const position = player?.position;
    const rotation = player?.rotation || [0, degToRad(180), 0];

    return (
        <>
            <group position={position}>
                {/* group applies yaw and scale to the whole cannon assembly */}
                <group rotation={[0, rotation[1], 0]} scale={3}>
                    {/* Cannon receives pitch (X) rotation */}
                    <Cannon rotation={[
                        rotation[0],
                        0,
                        0
                    ]} />

                    {/*
                        Put the ModelMan inside the same yaw/scale group so it follows cannon yaw.
                        Wrap it with a small group that applies the cannon pitch so it follows pitch too,
                        and cancel the parent scale with 1/3 so the character keeps its original size.
                    */}
                    <group
                        rotation={[
                            rotation[0],
                            degToRad(90),
                            degToRad(90)
                        ]}
                        scale={1 / 3}
                    >
                        <ModelMan
                            position={[2.25, 0, 0]}
                            rotation={[0, degToRad(90), 0]}
                            scale={1}
                            action={"HumanArmature|Man_Clapping"}
                        />
                    </group>
                </group>
            </group>
        </>
    )
}