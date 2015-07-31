declare function initWebGL(canvas: HTMLCanvasElement, attributes: {
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    premultipliedAlpha?: boolean;
    preserveDrawingBuffer?: boolean;
    stencil?: boolean;
}): WebGLRenderingContext;
export = initWebGL;
