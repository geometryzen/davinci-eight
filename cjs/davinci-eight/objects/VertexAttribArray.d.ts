/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
declare class VertexAttribArray {
    name: string;
    private size;
    private location;
    private buffer;
    constructor(name: string, size: number);
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    contextLoss(): void;
    bind(context: WebGLRenderingContext): void;
    bufferData(context: WebGLRenderingContext, geometry: Geometry): void;
    enable(context: WebGLRenderingContext): void;
    disable(context: WebGLRenderingContext): void;
}
export = VertexAttribArray;
