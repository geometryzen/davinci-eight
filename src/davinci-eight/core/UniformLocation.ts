import Cartesian1 = require('../math/Cartesian1')
import Cartesian2 = require('../math/Cartesian2')
import Cartesian3 = require('../math/Cartesian3')
import Cartesian4 = require('../math/Cartesian4')
import expectArg = require('../checks/expectArg')
import feedback = require('../feedback/feedback')
import Matrix1 = require('../math/Matrix1')
import Matrix2 = require('../math/Matrix2')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import IContextProgramConsumer = require('../core/IContextProgramConsumer')
import IContextProvider = require('../core/IContextProvider')
import Vector1 = require('../math/Vector1')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')
import Vector4 = require('../math/Vector4')

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
    this._context  = void 0;
    this._location = void 0;
    this._program  = void 0;
  }
  /**
   * @method cartesian1
   * @param coords {Cartesian1}
   */
  cartesian1(coords: Cartesian1): void {
    this._context.useProgram(this._program);
    this._context.uniform1f(this._location, coords.x);
  }
  /**
   * @method cartesian2
   * @param coords {Cartesian2}
   */
  cartesian2(coords: Cartesian2): void {
    this._context.useProgram(this._program);
    this._context.uniform2f(this._location, coords.x, coords.y);
  }
  /**
   * @method cartesian3
   * @param coords {Cartesian3}
   */
  cartesian3(coords: Cartesian3): void {
    if (coords) {
      this._context.useProgram(this._program)
      this._context.uniform3f(this._location, coords.x, coords.y, coords.z)
    }
  }
  /**
   * @method cartesian4
   * @param coords {Cartesian4}
   */
  cartesian4(coords: Cartesian4): void {
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
   * @param matrix {Matrix1}
   */
  matrix1(transpose: boolean, matrix: Matrix1): void {
    this._context.useProgram(this._program);
    this._context.uniform1fv(this._location, matrix.data);
  }
  /**
   * @method matrix2
   * @param transpose {boolean}
   * @param matrix {Matrix2}
   */
  matrix2(transpose: boolean, matrix: Matrix2): void {
    this._context.useProgram(this._program);
    this._context.uniformMatrix2fv(this._location, transpose, matrix.data);
  }
  /**
   * @method matrix3
   * @param transpose {boolean}
   * @param matrix {Matrix3}
   */
  matrix3(transpose: boolean, matrix: Matrix3): void {
    this._context.useProgram(this._program);
    this._context.uniformMatrix3fv(this._location, transpose, matrix.data);
  }
  /**
   * @method matrix4
   * @param transpose {boolean}
   * @param matrix {Matrix4}
   */
  matrix4(transpose: boolean, matrix: Matrix4): void {
    if (matrix) {
      this._context.useProgram(this._program)
      this._context.uniformMatrix4fv(this._location, transpose, matrix.data)
    }
  }
  /**
   * @method vector1
   * @param data {number[]}
   */
  vector1(data: number[]): void {
    this._context.useProgram(this._program);
    this._context.uniform1fv(this._location, data);
  }
  /**
   * @method vector2
   * @param data {number[]}
   */
  vector2(data: number[]): void {
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
