/**
 * Utility class for manageing a shader uniform variable.
 */
declare class ShaderUniformVariable {
    name: string;
    private location;
    private type;
    constructor(name: string, type: string);
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    matrix(context: WebGLRenderingContext, transpose: boolean, matrix: any): void;
    toString(): string;
}
export = ShaderUniformVariable;
