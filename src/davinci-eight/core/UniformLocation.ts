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

function matrix4NE(a: number[], b: Float32Array): boolean {
  return a[0x0] !== b[0x0]
   || a[0x1] !== b[0x1]
   || a[0x2] !== b[0x2]
   || a[0x3] !== b[0x3]
   || a[0x4] !== b[0x4]
   || a[0x5] !== b[0x5]
   || a[0x6] !== b[0x6]
   || a[0x7] !== b[0x7]
   || a[0x8] !== b[0x8]
   || a[0x9] !== b[0x9]
   || a[0xA] !== b[0xA]
   || a[0xB] !== b[0xB]
   || a[0xC] !== b[0xC]
   || a[0xD] !== b[0xD]
   || a[0xE] !== b[0xE]
   || a[0xF] !== b[0xF];
}

/**
 * Utility class for managing a shader uniform variable.
 * @class UniformLocation
 */
class UniformLocation implements RenderingContextProgramUser {
  private _name: string;
  private _location: WebGLUniformLocation;
  private _context: WebGLRenderingContext;
  private _x: number = void 0;
  private _y: number = void 0;
  private _z: number = void 0;
  private _w: number = void 0;
  private _matrix4: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => {return void 0;});
  private _transpose: boolean = void 0;
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
    this.contextLoss();
  }
  /**
   * @method contextGain
   * @param context {WebGLRenderingContext}
   * @param program {WebGLProgram}
   */
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    this.contextLoss();
    this._location = context.getUniformLocation(program, this._name);
    this._context = context;
  }
  /**
   * @method contextLoss
   */
  contextLoss() {
    this._location = void 0;
    this._context  = void 0;
    this._x = void 0;
    this._y = void 0;
    this._z = void 0;
    this._w = void 0;
    this._matrix4.map(() => {return void 0});
    this._transpose = void 0;
  }
  /**
   * @method uniform1f
   * @param x
   */
  uniform1f(x: number): void {
    if (this._x !== x) {
      this._context.uniform1f(this._location, x);
      this._x = x;
    }
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
    let matrix4 = this._matrix4;
    let data = matrix.data;
    if (matrix4NE(matrix4, data) || this._transpose != transpose) {
      this._context.uniformMatrix4fv(this._location, transpose, data);
      // TODO: Use Matrix4.
      matrix4[0x0] = data[0x0];
      matrix4[0x1] = data[0x1];
      matrix4[0x2] = data[0x2];
      matrix4[0x3] = data[0x3];
      matrix4[0x4] = data[0x4];
      matrix4[0x5] = data[0x5];
      matrix4[0x6] = data[0x6];
      matrix4[0x7] = data[0x7];
      matrix4[0x8] = data[0x8];
      matrix4[0x9] = data[0x9];
      matrix4[0xA] = data[0xA];
      matrix4[0xB] = data[0xB];
      matrix4[0xC] = data[0xC];
      matrix4[0xD] = data[0xD];
      matrix4[0xE] = data[0xE];
      matrix4[0xF] = data[0xF];
      this._transpose = transpose;
    }
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
    let data: number[] = vector.data;
    let x = data[0];
    let y = data[1];
    let z = data[2];
    if (this._x !== x || this._y !== y || this._z !== z) {
      this._context.uniform3fv(this._location, data);
      this._x = x;
      this._y = y;
      this._z = z;
    }
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
