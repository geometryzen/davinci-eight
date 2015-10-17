import Cartesian1 = require('../math/Cartesian1');
import Cartesian2 = require('../math/Cartesian2');
import Cartesian3 = require('../math/Cartesian3');
import Cartesian4 = require('../math/Cartesian4');
import MutableNumber = require('../math/MutableNumber');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import IContextProgramConsumer = require('../core/IContextProgramConsumer');
import IContextProvider = require('../core/IContextProvider');
/**
 * Utility class for managing a shader uniform variable.
 * @class UniformLocation
 */
declare class UniformLocation implements IContextProgramConsumer {
    private _context;
    private _location;
    private _name;
    private _program;
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
     * @method cartesian1
     * @param coords {Cartesian1}
     */
    cartesian1(coords: Cartesian1): void;
    /**
     * @method cartesian2
     * @param coords {Cartesian2}
     */
    cartesian2(coords: Cartesian2): void;
    /**
     * @method cartesian3
     * @param coords {Cartesian3}
     */
    cartesian3(coords: Cartesian3): void;
    /**
     * @method cartesian4
     * @param coords {Cartesian4}
     */
    cartesian4(coords: Cartesian4): void;
    /**
     * @method uniform1f
     * @param x {number}
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
     * @param matrix {MutableNumber}
     */
    matrix1(transpose: boolean, matrix: MutableNumber): void;
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
     * @method vector2
     * @param data {number[]}
     */
    vector2(data: number[]): void;
    /**
     * @method vector3
     * @param data {number[]}
     */
    vector3(data: number[]): void;
    /**
     * @method vector4
     * @param data {number[]}
     */
    vector4(data: number[]): void;
    /**
     * @method toString
     */
    toString(): string;
}
export = UniformLocation;
