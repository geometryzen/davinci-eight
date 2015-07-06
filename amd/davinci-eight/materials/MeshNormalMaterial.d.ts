declare class MeshNormalMaterial implements Material {
    private material;
    constructor();
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, contextGainId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
    attributes: {
        modifiers: string[];
        type: string;
        name: string;
    }[];
    uniforms: {
        modifiers: string[];
        type: string;
        name: string;
    }[];
    varyings: {
        modifiers: string[];
        type: string;
        name: string;
    }[];
    program: WebGLProgram;
    programId: string;
}
export = MeshNormalMaterial;
