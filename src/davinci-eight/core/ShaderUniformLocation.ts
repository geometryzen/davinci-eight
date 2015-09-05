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
 * @class ShaderUniformLocation
 */
class ShaderUniformLocation implements RenderingContextProgramUser {
  public name: string;
  private context: WebGLRenderingContext;
  private location: WebGLUniformLocation;
  /**
   * @class ShaderUniformLocation
   * @constructor
   * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
   */
  constructor(name: string) {
    this.name = name;
  }
  /**
   * @method contextFree
   */
  contextFree() {
    this.location = void 0;
    this.context = void 0;
  }
  /**
   * @method contextGain
   * @param context {WebGLRenderingContext}
   * @param program {WebGLProgram}
   */
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    if (this.context !== context) {
      this.location = context.getUniformLocation(program, this.name);
      this.context = context;
    }
  }
  /**
   * @method contextLoss
   */
  contextLoss() {
    this.location = void 0;
    this.context = void 0;
  }
  /**
   * @method uniform1f
   * @param x
   */
  uniform1f(x: number) {
    this.context.uniform1f(this.location, x);
  }
  /**
   * @method uniform2f
   * @param x {number}
   * @param y {number}
   */
  uniform2f(x: number, y: number) {
    this.context.uniform2f(this.location, x, y);
  }
  /**
   * @method uniform3f
   * @param x {number}
   * @param y {number}
   * @param z {number}
   */
  uniform3f(x: number, y: number, z: number) {
    this.context.uniform3f(this.location, x, y, z);
  }
  /**
   * @method uniform4f
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @param w {number}
   */
  uniform4f(x: number, y: number, z: number, w: number) {
    this.context.uniform4f(this.location, x, y, z, w);
  }
  /**
   * @method uniformMatrix1
   * @param transpose {boolean}
   * @param matrix {Matrix1}
   */
  uniformMatrix1(transpose: boolean, matrix: Matrix1) {
    this.context.uniform1fv(this.location, matrix.data);
  }
  /**
   * @method uniformMatrix2
   * @param transpose {boolean}
   * @param matrix {Matrix2}
   */
  uniformMatrix2(transpose: boolean, matrix: Matrix2) {
    this.context.uniformMatrix2fv(this.location, transpose, matrix.data);
  }
  /**
   * @method uniformMatrix3
   * @param transpose {boolean}
   * @param matrix {Matrix3}
   */
  uniformMatrix3(transpose: boolean, matrix: Matrix3) {
    this.context.uniformMatrix3fv(this.location, transpose, matrix.data);
  }
  /**
   * @method uniformMatrix4
   * @param transpose {boolean}
   * @param matrix {Matrix4}
   */
  uniformMatrix4(transpose: boolean, matrix: Matrix4) {
    this.context.uniformMatrix4fv(this.location, transpose, matrix.data);
  }
  /**
   * @method uniformVector1
   * @param vector {Vector1}
   */
  uniformVector1(vector: Vector1) {
    this.context.uniform1fv(this.location, vector.data);
  }
  /**
   * @method uniformVector2
   * @param vector {Vector2}
   */
  uniformVector2(vector: Vector2) {
    this.context.uniform2fv(this.location, vector.data);
  }
  /**
   * @method uniformVector3
   * @param vector {Vector3}
   */
  uniformVector3(vector: Vector3) {
    this.context.uniform3fv(this.location, vector.data);
  }
  /**
   * @method uniformVector4
   * @param vector {Vector4}
   */
  uniformVector4(vector: Vector4) {
    this.context.uniform4fv(this.location, vector.data);
  }
  /**
   * @method toString
   */
  toString(): string {
    return ["ShaderUniformLocation(", this.name, ")"].join('');
  }
}

export = ShaderUniformLocation;
