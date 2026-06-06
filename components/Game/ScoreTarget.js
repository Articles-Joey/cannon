import { useStore } from "@/hooks/useStore"

import { PaintBucket } from "../Models/PaintBucket"
import { Cylinder } from "@react-three/drei"
import WaterPlane from "./WaterPlane"

export default function ScoreTarget() {

    const darkMode = useStore(state => state.darkMode)

    const toontownMode = useStore(state => state.toontownMode)

    const color = darkMode ? "#8B0000" : "red";

    if (toontownMode) {

        return (
            <>

            </>
        )

    } else {

        return (
            <>

                <mesh castShadow position={[0, -14, 0]}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    {/* <BeachBall /> */}
                    <meshStandardMaterial color={color} />
                </mesh>

                <Cylinder
                    position={[0, -7, 0]} args={[1, 1, 14, 8]} material-color={color}
                />

                <WaterPlane
                    position={[0, 6, 0]}
                />

                <PaintBucket
                    scale={50}
                // position={[goalLocation[0], goalLocation[1], [goalLocation[2]]]}
                // position={[0, 14, 0]}
                />
            </>
        )

    }

}