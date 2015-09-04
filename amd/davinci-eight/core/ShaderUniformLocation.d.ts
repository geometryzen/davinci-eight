import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');
import Vector3 = require('../math/Vector3');
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
     * @method uniformMatrix2
     * @param transpose {boolean}
     * @param matrix {Matrix2}
     */
    uniformMatrix2(transpose: boolean, matrix: Matrix2): void;
    /**
     * @method uniformMatrix3
     * @param transpose {boolean}
     * @param matrix {Matrix3}
     */
    uniformMatrix3(transpose: boolean, matrix: Matrix3): void;
    /**
     * @method uniformMatrix4
     * @param transpose {boolean}
     * @param matrix {Matrix4}
     */
    uniformMatrix4(transpose: boolean, matrix: Matrix4): void;
    /**
     * @method uniformVector3
     * @param vector {Vector3}
     */
    uniformVector3(vector: Vector3): void;
    /**
     * @method toString
     */
    toString(): string;
}
export = ShaderUniformLocation;
