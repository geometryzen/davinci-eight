import mustBeString from '../checks/mustBeString';
import Mat2R from '../math/Mat2R';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';
import IContextProgramConsumer from './IContextProgramConsumer';
import VectorE1 from '../math/VectorE1';
import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';

/**
 * Utility class for managing a shader uniform variable.
 * @class UniformLocation
 */
export default class UniformLocation implements IContextProgramConsumer {
    private _context: WebGLRenderingContext;
    private _location: WebGLUniformLocation;
    private _name: string;
    private _program: WebGLProgram;

    /**
     * @class UniformLocation
     * @constructor
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     */
    constructor(name: string) {
        this._name = mustBeString('name', name);
    }

    /**
     * @method contextFree
     */
    contextFree() {
        this.contextLost();
    }

    /**
     * @method contextGain
     * @param context {WebGLRenderingContext}
     * @param program {WebGLProgram}
     */
    contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
        this.contextLost();
        this._context = context;
        // FIXME: Uniform locations are created for a specific program,
        // which means that locations cannot be shared.
        this._location = context.getUniformLocation(program, this._name);
        this._program = program;
    }

    /**
     * @method contextLost
     */
    contextLost() {
        this._context = void 0;
        this._location = void 0;
        this._program = void 0;
    }

    /**
     * Calls <code>uniform1f</code> on the underlying <code>WebGLUniformLocation</code>.
     * @method vec1
     * @param coords {VectorE1}
     * @return {UniformLocation}
     * @chainable
     */
    vec1(coords: VectorE1): UniformLocation {
        this._context.uniform1f(this._location, coords.x)
        return this
    }

    /**
     * Calls <code>uniform2f</code> on the underlying <code>WebGLUniformLocation</code>.
     * @method vec2
     * @param coords {VectorE2}
     * @return {UniformLocation}
     * @chainable
     */
    vec2(coords: VectorE2): UniformLocation {
        this._context.uniform2f(this._location, coords.x, coords.y)
        return this
    }

    /**
     * Calls <code>uniform3f</code> on the underlying <code>WebGLUniformLocation</code>.
     * @method vec3
     * @param coords {VectorE3}
     * @return {UniformLocation}
     * @chainable
     */
    vec3(coords: VectorE3): UniformLocation {
        this._context.uniform3f(this._location, coords.x, coords.y, coords.z)
        return this
    }

    /**
     * Calls <code>uniform4f</code> on the underlying <code>WebGLUniformLocation</code>.
     * @method vec4
     * @param coords {VectorE4}
     * @return {UniformLocation}
     * @chainable
     */
    vec4(coords: VectorE4): UniformLocation {
        this._context.uniform4f(this._location, coords.x, coords.y, coords.z, coords.w)
        return this
    }

    /**
     * @method uniform1f
     * @param x {number}
     */
    uniform1f(x: number): void {
        this._context.uniform1f(this._location, x)
    }

    /**
     * @method uniform2f
     * @param x {number}
     * @param y {number}
     */
    uniform2f(x: number, y: number): void {
        this._context.uniform2f(this._location, x, y)
    }

    /**
     * @method uniform3f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    uniform3f(x: number, y: number, z: number): void {
        this._context.uniform3f(this._location, x, y, z)
    }

    /**
     * @method uniform4f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param w {number}
     */
    uniform4f(x: number, y: number, z: number, w: number): void {
        this._context.uniform4f(this._location, x, y, z, w)
    }

    /**
     * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
     * @method mat2
     * @param matrix {Mat2R}
     * @param [transpose = false] {boolean}
     * @return {UniformLocation}
     * @chainable
     */
    mat2(matrix: Mat2R, transpose = false): UniformLocation {
        this._context.uniformMatrix2fv(this._location, transpose, matrix.elements)
        return this
    }

    /**
     * Sets a uniform location of type <code>mat3</code> in the <code>WebGLProgram</code>.
     * @method mat3
     * @param matrix {Mat3R}
     * @param [transpose = false] {boolean}
     * @return {UniformLocation}
     * @chainable
     */
    mat3(matrix: Mat3R, transpose = false): UniformLocation {
        this._context.uniformMatrix3fv(this._location, transpose, matrix.elements)
        return this
    }

    /**
     * Sets a uniform location of type <code>mat4</code> in the <code>WebGLProgram</code>.
     * @method mat4
     * @param matrix {Mat4R}
     * @param [transpose = false] {boolean}
     * @return {UniformLocation}
     * @chainable
     */
    mat4(matrix: Mat4R, transpose = false): UniformLocation {
        this._context.uniformMatrix4fv(this._location, transpose, matrix.elements)
        return this
    }

    /**
     * @method vector2
     * @param data {number[] | Float32Array}
     */
    vector2(data: number[] | Float32Array): void {
        this._context.uniform2fv(this._location, <any>data)
    }

    /**
     * @method vector3
     * @param data {number[] | Float32Array}
     */
    vector3(data: number[] | Float32Array): void {
        this._context.uniform3fv(this._location, <any>data)
    }

    /**
     * @method vector4
     * @param data {number[] | Float32Array}
     */
    vector4(data: number[] | Float32Array): void {
        this._context.uniform4fv(this._location, <any>data)
    }

    /**
     * @method toString
     */
    toString(): string {
        return ['uniform', this._name].join(' ');
    }
}
