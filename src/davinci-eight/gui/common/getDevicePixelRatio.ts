
export default function getDevicePixelRatio(ctx: CanvasRenderingContext2D) {
    let devicePixelRatio = window.devicePixelRatio || 1;
    let backingStoreRatio = ctx['webkitBackingStorePixelRatio'] ||
        ctx['mozBackingStorePixelRatio'] ||
        ctx['msBackingStorePixelRatio'] ||
        ctx['oBackingStorePixelRatio'] ||
        ctx['backingStorePixelRatio'] || 1;
    return devicePixelRatio / backingStoreRatio;
}
