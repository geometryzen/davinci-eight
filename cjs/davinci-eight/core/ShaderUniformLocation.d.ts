import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');
import ShaderUniformSetter = require('../core/ShaderUniformSetter');
/**
 * Utility class for managing a shader uniform variable.
 * @class ShaderUniformLocation
 */
declare class ShaderUniformLocation implements RenderingContextProgramUser {
    name: string;
    private context;
    private location;
    /**
     * @class ShaderUniformLocation
     * @constructor
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     */
    constructor(name: string);
    /**
     * @method release
     */
    release(): void;
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
    createSetter(gl: WebGLRenderingContext, uniformInfo: WebGLActiveInfo): ShaderUniformSetter;
    /**
     * @method uniform1f
     * @param x {number} Value to assign.
     */
    uniform1f(x: number): void;
    /**
     * @method uniform1fv
     * @param data {number[]}
     */
    uniform1fv(data: number[]): void;
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
     * @method uniform3f
     * @param x {number} Horizontal value to assign.
     * @param y {number} Vertical number to assign.
     * @param z {number}
     */
    uniform3f(x: number, y: number, z: number): void;
    /**
     * @method uniform3fv
     * @param data {number[]}
     */
    uniform3fv(data: number[]): void;
    /**
     * @method uniform3f
     * @param x {number} Horizontal value to assign.
     * @param y {number} Vertical number to assign.
     * @param z {number}
     * @param w {number}
     */
    uniform4f(x: number, y: number, z: number, w: number): void;
    /**
     * @method uniform4fv
     * @param data {number[]}
     */
    uniform4fv(data: number[]): void;
    /**
     * @method uniformMatrix2fv
     * @param transpose {boolean}
     * @param matrix {Float32Array}
     */
    uniformMatrix2fv(transpose: boolean, matrix: Float32Array): void;
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
export = ShaderUniformLocation;
