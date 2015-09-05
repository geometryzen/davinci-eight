import expectArg = require('../checks/expectArg');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');

/**
 * Utility class for managing a shader uniform variable.
 * @class UniformLocation
 */
class UniformLocation implements RenderingContextProgramUser {
  private _name: string;
  private _context: WebGLRenderingContext;
  private _location: WebGLUniformLocation;
  /**
   * @class UniformLocation
   * @constructor
   * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
   */
  constructor(name: string) {
    this._name = expectArg('name', name).toBeString().value;
  }
  /**
   * @method contextFree
   */
  contextFree() {
    this._location = void 0;
    this._context = void 0;
  }
  /**
   * @method contextGain
   * @param context {WebGLRenderingContext}
   * @param program {WebGLProgram}
   */
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    if (this._context !== context) {
      this._location = context.getUniformLocation(program, this._name);
      this._context = context;
    }
  }
  /**
   * @method contextLoss
   */
  contextLoss() {
    this._location = void 0;
    this._context = void 0;
  }
  /**
   * @method uniform1f
   * @param x
   */
  uniform1f(x: number): void {
    return this._context.uniform1f(this._location, x);
  }
  /**
   * @method uniform2f
   * @param x {number}
   * @param y {number}
   */
  uniform2f(x: number, y: number): void {
    return this._context.uniform2f(this._location, x, y);
  }
  /**
   * @method uniform3f
   * @param x {number}
   * @param y {number}
   * @param z {number}
   */
  uniform3f(x: number, y: number, z: number): void {
    return this._context.uniform3f(this._location, x, y, z);
  }
  /**
   * @method uniform4f
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @param w {number}
   */
  uniform4f(x: number, y: number, z: number, w: number): void {
    return this._context.uniform4f(this._location, x, y, z, w);
  }
  /**
   * @method matrix1
   * @param transpose {boolean}
   * @param matrix {Matrix1}
   */
  matrix1(transpose: boolean, matrix: Matrix1): void {
    return this._context.uniform1fv(this._location, matrix.data);
  }
  /**
   * @method matrix2
   * @param transpose {boolean}
   * @param matrix {Matrix2}
   */
  matrix2(transpose: boolean, matrix: Matrix2): void {
    return this._context.uniformMatrix2fv(this._location, transpose, matrix.data);
  }
  /**
   * @method matrix3
   * @param transpose {boolean}
   * @param matrix {Matrix3}
   */
  matrix3(transpose: boolean, matrix: Matrix3): void {
    return this._context.uniformMatrix3fv(this._location, transpose, matrix.data);
  }
  /**
   * @method matrix4
   * @param transpose {boolean}
   * @param matrix {Matrix4}
   */
  matrix4(transpose: boolean, matrix: Matrix4): void {
    return this._context.uniformMatrix4fv(this._location, transpose, matrix.data);
  }
  /**
   * @method vector1
   * @param vector {Vector1}
   */
  vector1(vector: Vector1): void {
    return this._context.uniform1fv(this._location, vector.data);
  }
  /**
   * @method vector2
   * @param vector {Vector2}
   */
  vector2(vector: Vector2): void {
    return this._context.uniform2fv(this._location, vector.data);
  }
  /**
   * @method vector3
   * @param vector {Vector3}
   */
  vector3(vector: Vector3): void {
    return this._context.uniform3fv(this._location, vector.data);
  }
  /**
   * @method vector4
   * @param vector {Vector4}
   */
  vector4(vector: Vector4): void {
    return this._context.uniform4fv(this._location, vector.data);
  }
  /**
   * @method toString
   */
  toString(): string {
    return ['uniform', this._name].join(' ');
  }
}

export = UniformLocation;
