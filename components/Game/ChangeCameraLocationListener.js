import { useCannonStore } from "@/hooks/useCannonStore";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function ChangeCameraLocationListener() {

    const { camera, controls } = useThree();

    // Your implementation here
    const changeCameraLocation = useCannonStore((state) => state.changeCameraLocation);
    const setChangeCameraLocation = useCannonStore((state) => state.setChangeCameraLocation);

    useEffect(() => {

        if (changeCameraLocation) {

            // camera.position.set(0, 10, 80);

            console.log('changeCameraLocation', changeCameraLocation);

            const handleCameraLocationChange = () => {
                if (changeCameraLocation) {
                    camera.position.set(changeCameraLocation[0], changeCameraLocation[1], changeCameraLocation[2]);
                    setChangeCameraLocation(null);
                }
            };

            handleCameraLocationChange();

            if (controls) {
                controls.target.set(0, 0, 40);
                controls.update();
            }

            setChangeCameraLocation(null);

        }

    }, [changeCameraLocation]);

    return null;
}