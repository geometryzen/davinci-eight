/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
/**
 * Manages the (optional) WebGLBuffer used to support gl.drawElements().
 */
declare class ElementArray {
    private buffer;
    private geometry;
    constructor(geometry: Geometry);
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    bufferData(context: WebGLRenderingContext, geometry: Geometry): void;
    bind(context: WebGLRenderingContext): void;
}
export = ElementArray;
