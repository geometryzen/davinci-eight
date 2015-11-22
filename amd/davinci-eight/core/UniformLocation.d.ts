import VectorE1 = require('../math/VectorE1');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');
import R1 = require('../math/R1');
import Mat2R = require('../math/Mat2R');
import Mat3R = require('../math/Mat3R');
import Mat4R = require('../math/Mat4R');
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
     * @param coords {VectorE1}
     */
    cartesian1(coords: VectorE1): void;
    /**
     * @method cartesian2
     * @param coords {VectorE2}
     */
    cartesian2(coords: VectorE2): void;
    /**
     * @method cartesian3
     * @param coords {VectorE3}
     */
    cartesian3(coords: VectorE3): void;
    /**
     * @method cartesian4
     * @param coords {VectorE4}
     */
    cartesian4(coords: VectorE4): void;
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
     * @param matrix {R1}
     */
    matrix1(transpose: boolean, matrix: R1): void;
    /**
     * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
     * @method mat2
     * @param matrix {Mat2R}
     * @param [transpose = false] {boolean}
     * @return {UniformLocation}
     * @chainable
     */
    mat2(matrix: Mat2R, transpose?: boolean): UniformLocation;
    /**
     * Sets a uniform location of type <code>mat3</code> in the <code>WebGLProgram</code>.
     * @method mat3
     * @param matrix {Mat3R}
     * @param [transpose = false] {boolean}
     * @return {UniformLocation}
     * @chainable
     */
    mat3(matrix: Mat3R, transpose?: boolean): UniformLocation;
    /**
     * Sets a uniform location of type <code>mat4</code> in the <code>WebGLProgram</code>.
     * @method mat4
     * @param matrix {Mat4R}
     * @param [transpose = false] {boolean}
     * @return {UniformLocation}
     * @chainable
     */
    mat4(matrix: Mat4R, transpose?: boolean): UniformLocation;
    /**
     * @method vector2
     * @param data {Array<number> | Float32Array}
     */
    vector2(data: number[] | Float32Array): void;
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
