import { useStore } from "@/hooks/useStore";
import { useTexture } from "@react-three/drei";
import { FrontSide } from "three";

export default function ImageRing({ segments = 8, imageHeight = 50, radius = 200 }) {

    const darkMode = useStore(state => state.darkMode);

    const images = [
        "/img/toontown/BG5_1.png",
        "/img/toontown/BG5_2.png",
        "/img/toontown/BG5_3.png",
    ];

    const textures = useTexture(images);
    
    // Auto-calculate width to fit the segment size of the circle's circumference
    // (circumference / segments) * a small overlap factor (1.05) to prevent gaps
    const segmentWidth = ((2 * Math.PI * radius) / segments) * 1.055;

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
                        renderOrder={1}
                    >
                        <planeGeometry args={[segmentWidth, imageHeight]} />
                        <meshBasicMaterial 
                            map={texture} 
                            transparent={true} 
                            side={FrontSide} 
                            depthWrite={false}
                            color={darkMode ? "#5f5f5f" : "white"}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}