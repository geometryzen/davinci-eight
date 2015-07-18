/**
 * Utility class for managing a shader uniform variable.
 * @class ShaderUniformVariable
 */
declare class ShaderUniformVariable {
    name: string;
    type: string;
    private context;
    private location;
    /**
     * @class ShaderUniformVariable
     * @constructor
     * @param name {string} The name of the uniform variable, as it appears in the vertex shader code.
     * @param type {string} The type of the uniform variale, as it appears in the vertex shader code.
     */
    constructor(name: string, type: string);
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
     * @method vec3
     * @param data {number[]}
     */
    vec3(data: number[]): void;
    /**
     * @method mat3
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    mat3(transpose: boolean, matrix: Float32Array): void;
    /**
     * @method mat4
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    mat4(transpose: boolean, matrix: Float32Array): void;
    /**
     * @method toString
     */
    toString(): string;
}
export = ShaderUniformVariable;
