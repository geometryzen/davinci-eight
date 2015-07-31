import RenderingContextMonitor = require('../utils/RenderingContextMonitor');
declare function contextMonitor(canvas: HTMLCanvasElement, attributes?: {
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    premultipliedAlpha?: boolean;
    preserveDrawingBuffer?: boolean;
    stencil?: boolean;
}): RenderingContextMonitor;
export = contextMonitor;
