import VectorE1 = require('../math/VectorE1')
import VectorE2 = require('../math/VectorE2')
import VectorE3 = require('../math/VectorE3')
import VectorE4 = require('../math/VectorE4')
import expectArg = require('../checks/expectArg')
import feedback = require('../feedback/feedback')
import R1 = require('../math/R1')
import Mat2R = require('../math/Mat2R')
import Mat3R = require('../math/Mat3R')
import Mat4R = require('../math/Mat4R')
import IContextProgramConsumer = require('../core/IContextProgramConsumer')
import IContextProvider = require('../core/IContextProvider')
import R2 = require('../math/R2')
import R3 = require('../math/R3')
import R4 = require('../math/R4')

/**
 * Utility class for managing a shader uniform variable.
 * @class UniformLocation
 */
class UniformLocation implements IContextProgramConsumer {
    private _context: WebGLRenderingContext;
    private _location: WebGLUniformLocation;
    private _name: string;
    private _program: WebGLProgram;
    /**
     * @class UniformLocation
     * @constructor
     * @param manager {IContextProvider} Unused. May be used later e.g. for mirroring.
     * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
     */
    constructor(manager: IContextProvider, name: string) {
        expectArg('manager', manager).toBeObject().value;
        this._name = expectArg('name', name).toBeString().value;
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
     * @method cartesian1
     * @param coords {VectorE1}
     */
    cartesian1(coords: VectorE1): void {
        this._context.useProgram(this._program);
        this._context.uniform1f(this._location, coords.x);
    }
    /**
     * @method cartesian2
     * @param coords {VectorE2}
     */
    cartesian2(coords: VectorE2): void {
        this._context.useProgram(this._program);
        this._context.uniform2f(this._location, coords.x, coords.y);
    }
    /**
     * @method cartesian3
     * @param coords {VectorE3}
     */
    cartesian3(coords: VectorE3): void {
        if (coords) {
            this._context.useProgram(this._program)
            this._context.uniform3f(this._location, coords.x, coords.y, coords.z)
        }
    }
    /**
     * @method cartesian4
     * @param coords {VectorE4}
     */
    cartesian4(coords: VectorE4): void {
        this._context.useProgram(this._program);
        this._context.uniform4f(this._location, coords.x, coords.y, coords.z, coords.w);
    }
    /**
     * @method uniform1f
     * @param x {number}
     */
    uniform1f(x: number): void {
        this._context.useProgram(this._program);
        this._context.uniform1f(this._location, x);
    }
    /**
     * @method uniform2f
     * @param x {number}
     * @param y {number}
     */
    uniform2f(x: number, y: number): void {
        this._context.useProgram(this._program);
        this._context.uniform2f(this._location, x, y);
    }
    /**
     * @method uniform3f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    uniform3f(x: number, y: number, z: number): void {
        this._context.useProgram(this._program);
        this._context.uniform3f(this._location, x, y, z);
    }
    /**
     * @method uniform4f
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param w {number}
     */
    uniform4f(x: number, y: number, z: number, w: number): void {
        this._context.useProgram(this._program);
        this._context.uniform4f(this._location, x, y, z, w);
    }
    /**
     * @method matrix1
     * @param transpose {boolean}
     * @param matrix {R1}
     */
    matrix1(transpose: boolean, matrix: R1): void {
        this._context.useProgram(this._program);
        this._context.uniform1fv(this._location, matrix.coords);
    }

    /**
     * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
     * @method mat2
     * @param matrix {Mat2R}
     * @param [transpose = false] {boolean}
     * @return {UniformLocation}
     * @chainable
     */
    mat2(matrix: Mat2R, transpose: boolean = false): UniformLocation {
        this._context.useProgram(this._program)
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
    mat3(matrix: Mat3R, transpose: boolean = false): UniformLocation {
        this._context.useProgram(this._program)
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
    mat4(matrix: Mat4R, transpose: boolean = false): UniformLocation {
        this._context.useProgram(this._program)
        this._context.uniformMatrix4fv(this._location, transpose, matrix.elements)
        return this
    }

    /**
     * @method vector2
     * @param data {Array<number> | Float32Array}
     */
    vector2(data: number[] | Float32Array): void {
        this._context.useProgram(this._program);
        this._context.uniform2fv(this._location, data);
    }
    /**
     * @method vector3
     * @param data {number[]}
     */
    vector3(data: number[]): void {
        this._context.useProgram(this._program);
        this._context.uniform3fv(this._location, data);
    }
    /**
     * @method vector4
     * @param data {number[]}
     */
    vector4(data: number[]): void {
        this._context.useProgram(this._program);
        this._context.uniform4fv(this._location, data);
    }
    /**
     * @method toString
     */
    toString(): string {
        return ['uniform', this._name].join(' ');
    }
}

export = UniformLocation;
