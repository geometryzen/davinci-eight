/**
 * Utility class for managing a shader uniform variable.
 */
declare class ShaderUniformVariable {
    name: string;
    type: string;
    private location;
    constructor(name: string, type: string);
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    matrix(context: WebGLRenderingContext, transpose: boolean, matrix: any): void;
    toString(): string;
}
export = ShaderUniformVariable;
