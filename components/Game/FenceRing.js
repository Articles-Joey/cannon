import { useStore } from "@/hooks/useStore";
import { useTexture } from "@react-three/drei";
import { FrontSide } from "three";

export default function FenceRing({ segments = 80, imageHeight = 5, radius = 100 }) {

    const darkMode = useStore(state => state.darkMode);

    const images = [
        "/img/toontown/fence_with_flower.png",
    ];

    const textures = useTexture(images);
    
    // Auto-calculate width to fit the segment size of the circle's circumference
    // (circumference / segments) * a small overlap factor (1.05) to prevent gaps
    const segmentWidth = ((2 * Math.PI * radius) / segments) * 1.05;

    return (
        <group>
            {[...Array(segments)].map((_, index) => {
                const texture = textures[index % textures.length];
                const angle = (index / segments) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                return (
                    <mesh 
                        key={index} 
                        position={[x, imageHeight / 2, z]} 
                        rotation={[0, -angle - Math.PI / 2, 0]}
                        renderOrder={2}
                    >
                        <planeGeometry args={[segmentWidth, imageHeight]} />
                        <meshBasicMaterial 
                            map={texture} 
                            transparent={true} 
                            side={FrontSide} 
                            depthWrite={false}
                            color={darkMode ? "#808080" : "white"}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}