import { useStore } from "@/hooks/useStore";
import { useTexture } from "@react-three/drei";

import { NearestFilter, RepeatWrapping } from "three";

const GrassPlane = () => {
    const graphicsQuality = useStore(state => state.graphicsQuality)
    const [colorMap, normalMap] = useTexture([
        '/textures/Grass/Poliigon_GrassPatchyGround_4585_BaseColor.jpg',
        '/textures/Grass/Poliigon_GrassPatchyGround_4585_Normal.png'
    ])

    let width
    let height

    let baseAmount = 300

    if (graphicsQuality == 'Low') {
        width = baseAmount
        height = baseAmount
    }
    if (graphicsQuality == 'Medium') {
        width = baseAmount * 2
        height = baseAmount * 2
    }
    if (graphicsQuality == 'High') {
        width = baseAmount * 3
        height = baseAmount * 3
    }

    [colorMap, normalMap].forEach((t) => {
        t.magFilter = NearestFilter;
        t.wrapS = RepeatWrapping
        t.wrapT = RepeatWrapping
        t.repeat.set(width / 10, height / 10)
    })

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={colorMap} normalMap={normalMap} />
            </mesh>
        </>
    );
};

export default GrassPlane