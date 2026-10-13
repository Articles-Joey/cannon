// Shared by the visible tower and its scoring/collision volumes.
export const WATER_TOWER_DIMENSIONS = Object.freeze({
    height: 20,
    bucketHeight: 6,
    topRadius: 4.25,
    bottomRadius: 3.25,
    wallThickness: 0.25,
    plankCount: 32,
    waterInset: 0.08,
});

export function getWaterTowerWaterRadius({
    bucketHeight,
    topRadius,
    bottomRadius,
    wallThickness,
    plankCount,
    waterInset,
}) {
    const radius = topRadius - (topRadius - bottomRadius) * waterInset / bucketHeight;
    return (radius - wallThickness) * Math.cos(Math.PI / plankCount) - 0.02;
}
