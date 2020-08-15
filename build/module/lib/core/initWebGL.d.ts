/**
 * Returns a WebGL rendering context given a canvas element.
 * @param canvas The canvas element.
 * @param options The arguments to the HTMLCanvasElement.getContext() method.
 * @param contextId An optional override for the context identifier.
 * If the canvas is undefined then an undefined value is returned for the context.
 */
export declare function initWebGL(canvas: HTMLCanvasElement, options: WebGLContextAttributes, contextId: 'webgl2' | 'webgl' | undefined): {
    context: WebGL2RenderingContext;
    contextId: 'webgl2';
} | {
    context: WebGLRenderingContext;
    contextId: 'webgl';
};
