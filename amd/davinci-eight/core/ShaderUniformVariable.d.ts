/**
 * Utility class for managing a shader uniform variable.
 * @class ShaderUniformVariable
 */
declare class ShaderUniformVariable {
    name: string;
    glslType: string;
    private context;
    private location;
    /**
     * @class ShaderUniformVariable
     * @constructor
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     * @param glslType {string} The type of the uniform variale, as it appears in the GLSL shader code.
     */
    constructor(name: string, glslType: string);
    /**
     * @method contextFree
     */
    contextFree(): void;
    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     */
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    /**
     * @method contextLoss
     */
    contextLoss(): void;
    /**
     * @method uniform2f
     * @param x {number} Horizontal value to assign.
     * @param y {number} Vertical number to assign.
     */
    uniform2f(x: number, y: number): void;
    /**
     * @method uniform2fv
     * @param data {number[]}
     */
    uniform2fv(data: number[]): void;
    /**
     * @method uniform3fv
     * @param data {number[]}
     */
    uniform3fv(data: number[]): void;
    /**
     * @method uniform4fv
     * @param data {number[]}
     */
    uniform4fv(data: number[]): void;
    /**
     * @method uniformMatrix3fv
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    uniformMatrix3fv(transpose: boolean, matrix: Float32Array): void;
    /**
     * @method uniformMatrix4fv
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    uniformMatrix4fv(transpose: boolean, matrix: Float32Array): void;
    /**
     * @method toString
     */
    toString(): string;
}
export = ShaderUniformVariable;
