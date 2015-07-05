/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
/**
 * Utility class for managing a shader attribute variable.
 */
declare class ShaderAttributeVariable {
    name: string;
    /**
     * The numbe of components for the attribute. Must be 1,2,3 , or 4.
     */
    private size;
    private normalized;
    private stride;
    private offset;
    private location;
    private buffer;
    constructor(name: string, size: number, normalized: boolean, stride: number, offset: number);
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    contextLoss(): void;
    bind(context: WebGLRenderingContext): void;
    bufferData(context: WebGLRenderingContext, geometry: Geometry): void;
    enable(context: WebGLRenderingContext): void;
    disable(context: WebGLRenderingContext): void;
}
export = ShaderAttributeVariable;
