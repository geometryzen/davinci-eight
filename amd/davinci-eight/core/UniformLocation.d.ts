import VectorE1 = require('../math/VectorE1');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');
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
     * Calls <code>uniform1f</code> on the underlying <code>WebGLUniformLocation</code>.
     * @method vec1
     * @param coords {VectorE1}
     * @return {UniformLocation}
     * @chainable
     */
    vec1(coords: VectorE1): UniformLocation;
    /**
     * Calls <code>uniform2f</code> on the underlying <code>WebGLUniformLocation</code>.
     * @method vec2
     * @param coords {VectorE2}
     * @return {UniformLocation}
     * @chainable
     */
    vec2(coords: VectorE2): UniformLocation;
    /**
     * Calls <code>uniform3f</code> on the underlying <code>WebGLUniformLocation</code>.
     * @method vec3
     * @param coords {VectorE3}
     * @return {UniformLocation}
     * @chainable
     */
    vec3(coords: VectorE3): UniformLocation;
    /**
     * Calls <code>uniform4f</code> on the underlying <code>WebGLUniformLocation</code>.
     * @method vec4
     * @param coords {VectorE4}
     * @return {UniformLocation}
     * @chainable
     */
    vec4(coords: VectorE4): UniformLocation;
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
