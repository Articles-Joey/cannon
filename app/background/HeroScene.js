import { ModelCannon } from "@/components/Models/Cannon";
import { ModelMan } from "@/components/Models/Man";
import { Text, OrbitControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { useRef, useState } from "react";
import ImageRing from "@/components/Game/ImageRing";
import FenceRing from "@/components/Game/FenceRing";
import GrassArea from "@/components/Game/GrassArea";
import GrassPlane from "@/components/Game/GrassPlane";
import { useStore } from "@/hooks/useStore";
import ScoreTarget from "@/components/Game/ScoreTarget";

export default function HeroScene() {

    const canvasRef = useRef();
    const [target, setTarget] = useState([0, 1, 0]);

    const toggleDarkMode = useStore(state => state.toggleDarkMode);

    const handleCapture = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // The background will be transparent if alpha: true and no background is set in the scene
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `scene-capture-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="background-page" style={{ position: 'relative', width: '100%', height: '100vh' }}>

            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <button
                    onClick={handleCapture}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    📷 Capture Transparent PNG
                </button>
                <button
                    onClick={() => {
                        toggleDarkMode();
                    }}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ☀️
                </button>

                <div style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '10px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '12px'
                }}>
                    <strong>LookAt Target (Y)</strong><br />
                    <input 
                        type="range" 
                        min="-5" 
                        max="10" 
                        step="0.1" 
                        value={target[1]} 
                        onChange={(e) => setTarget([0, parseFloat(e.target.value), 0])}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            <Canvas
                gl={{
                    preserveDrawingBuffer: true,
                    alpha: true
                }}
                onCreated={({ gl }) => {
                    canvasRef.current = gl.domElement;
                }}
                camera={{ 
                    position: [0, 2, 5], 
                    fov: 50,
                }}
            >
                <OrbitControls 
                    makeDefault 
                    target={target}
                />

                <Sky
                    distance={450000}
                    sunPosition={[0, 1, 0]}
                    inclination={0}
                    azimuth={0.25}
                />

                <ambientLight intensity={7} />

                <group
                    position={[0, 0, 0]}
                >

                    <ImageRing />
                    <FenceRing />
                    <GrassArea />
                    <GrassPlane />

                    <group
                        position={[0, 7, -25]}
                        scale={0.5}
                    >
                        <ScoreTarget />
                    </group>

                    <Text
                        position={[0, 2, 0]}
                        color="#000"
                    >
                        {process.env.NEXT_PUBLIC_GAME_NAME}
                    </Text>

                    <group>
                        <ModelCannon
                            position={[-1, 0, 0]}
                            rotation={[0, degToRad(50), 0]}
                        />
                        <ModelMan
                            position={[-2.25, 0, 0]}
                            scale={0.25}
                            action="HumanArmature|Man_Clapping"
                        />
                    </group>

                    <group>
                        <ModelCannon
                            position={[1, 0, 0]}
                            rotation={[0, degToRad(-50), 0]}
                        />
                        <ModelMan
                            position={[2.25, 0, 0]}
                            scale={0.25}
                            action="HumanArmature|Man_Clapping"
                        />
                    </group>

                </group>

            </Canvas>
        </div>
    )

}