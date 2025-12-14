import { useStore } from "@/hooks/useStore";

export default function minGraphicsQuality(level, currentGraphicsQuality) {

    // const graphicsQuality = useStore.getState().graphicsQuality;
    const graphicsQuality = currentGraphicsQuality

    if (!level) return graphicsQuality

    const levels = ['Low', 'Medium', 'High']

    let currentLevel = levels.indexOf(graphicsQuality)

    if (currentLevel === -1) {
        if (typeof graphicsQuality === 'number') {
            currentLevel = graphicsQuality
        } else {
            currentLevel = 1
        }
    }

    const checkLevel = levels.indexOf(level)

    return currentLevel >= checkLevel

}