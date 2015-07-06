/// <reference path="../../../src/davinci-eight/geometries/VertexAttributeProvider.d.ts" />
/**
 * Manages the (optional) WebGLBuffer used to support gl.drawElements().
 */
declare class ElementArray {
    private buffer;
    private geometry;
    constructor(geometry: VertexAttributeProvider);
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    bufferData(context: WebGLRenderingContext, geometry: VertexAttributeProvider): void;
    bind(context: WebGLRenderingContext): void;
}
export = ElementArray;
