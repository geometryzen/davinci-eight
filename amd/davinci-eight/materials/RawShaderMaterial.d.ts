/// <reference path="../../../src/davinci-eight/materials/Material.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
declare class RawShaderMaterial implements Material {
    attributes: string[];
    program: WebGLProgram;
    programId: string;
    private contextGainId;
    private vertexAttributes;
    private vertexShader;
    private fragmentShader;
    constructor(attributes: {
        name: string;
        size: number;
    }[], vertexShader: string, fragmentShader: string);
    enableVertexAttributes(context: WebGLRenderingContext): void;
    disableVertexAttributes(context: WebGLRenderingContext): void;
    bindVertexAttributes(context: WebGLRenderingContext): void;
    update(context: WebGLRenderingContext, time: number, geometry: Geometry): void;
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
}
export = RawShaderMaterial;
