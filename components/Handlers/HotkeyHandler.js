import { useStore } from "@/hooks/useStore";
import { useHotkeys } from "react-hotkeys-hook";

export default function HotkeyHandler() {

    useHotkeys('r', () => {
        console.log("Reloading Scene")
        useStore.getState().reloadScene();
    }, [])

    useHotkeys('slash+s', () => {
        console.log("Toggling Screenshot Mode")
        useStore.getState().toggleScreenshotMode();
    }, [])

    useHotkeys('slash+m', () => {
        console.log("Toggling Settings")
        useStore.getState().setShowSettingsModal(!useStore.getState().showSettingsModal);
    }, [])

    useHotkeys('slash+d', () => {
        console.log("Toggling Debug")
        useStore.getState().toggleDebug();
        useStore.getState().reloadScene();
    }, [])

}