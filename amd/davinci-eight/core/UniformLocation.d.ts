import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import IContextProgramConsumer = require('../core/IContextProgramConsumer');
import IContextProvider = require('../core/IContextProvider');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
/**
 * Utility class for managing a shader uniform variable.
 * @class UniformLocation
 */
declare class UniformLocation implements IContextProgramConsumer {
    private _context;
    private _location;
    private _name;
    private _program;
    private _x;
    private _y;
    private _z;
    private _w;
    private _matrix4;
    private _transpose;
    /**
     * @class UniformLocation
     * @constructor
     * @param manager {IContextProvider} Unused. May be used later e.g. for mirroring.
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     */
    constructor(manager: IContextProvider, name: string);
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
     * @method contextLost
     */
    contextLost(): void;
    /**
     * @method uniform1f
     * @param x
     */
    uniform1f(x: number): void;
    /**
     * @method uniform2f
     * @param x {number}
     * @param y {number}
     */
    uniform2f(x: number, y: number): void;
    /**
     * @method uniform3f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    uniform3f(x: number, y: number, z: number): void;
    /**
     * @method uniform4f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param w {number}
     */
    uniform4f(x: number, y: number, z: number, w: number): void;
    /**
     * @method matrix1
     * @param transpose {boolean}
     * @param matrix {Matrix1}
     */
    matrix1(transpose: boolean, matrix: Matrix1): void;
    /**
     * @method matrix2
     * @param transpose {boolean}
     * @param matrix {Matrix2}
     */
    matrix2(transpose: boolean, matrix: Matrix2): void;
    /**
     * @method matrix3
     * @param transpose {boolean}
     * @param matrix {Matrix3}
     */
    matrix3(transpose: boolean, matrix: Matrix3): void;
    /**
     * @method matrix4
     * @param transpose {boolean}
     * @param matrix {Matrix4}
     */
    matrix4(transpose: boolean, matrix: Matrix4): void;
    /**
     * @method vector1
     * @param vector {Vector1}
     */
    vector1(vector: Vector1): void;
    /**
     * @method vector2
     * @param vector {Vector2}
     */
    vector2(vector: Vector2): void;
    /**
     * @method vector3
     * @param vector {Vector3}
     */
    vector3(vector: Vector3): void;
    /**
     * @method vector4
     * @param vector {Vector4}
     */
    vector4(vector: Vector4): void;
    /**
     * @method toString
     */
    toString(): string;
}
export = UniformLocation;
