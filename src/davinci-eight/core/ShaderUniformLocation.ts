/**
 * Utility class for managing a shader uniform variable.
 * @class ShaderUniformLocation
 */
class ShaderUniformLocation {
  public name: string;
  public glslType: string;
  private context: WebGLRenderingContext;
  private location: WebGLUniformLocation;
  /**
   * @class ShaderUniformLocation
   * @constructor
   * @param name {string} The name of the uniform variable, as it appears in the GLSL shader code.
   * @param glslType {string} The type of the uniform variale, as it appears in the GLSL shader code.  
   */
  constructor(name: string, glslType: string) {
    this.name = name;
    switch(glslType) {
      case 'float':
      case 'vec2':
      case 'vec3':
      case 'vec4':
      case 'mat2':
      case 'mat3':
      case 'mat4': {
        this.glslType = glslType;
      }
      break;
      default: {
        throw new Error("Illegal argument glslType in ShaderUniformLocation constructor: " + glslType);
      }
    }
  }
  /**
   * @method contextFree
   */
  contextFree() {
    this.location = null;
    this.context = null;
  }
  /**
   * @method contextGain
   * @param context {WebGLRenderingContext}
   * @param program {WebGLProgram}
   */
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    this.location = context.getUniformLocation(program, this.name);
    this.context = context;
  }
  /**
   * @method contextLoss
   */
  contextLoss() {
    this.location = null;
    this.context = null;
  }
  /**
   * @method uniform1f
   * @param value {number} Value to assign.
   */
  uniform1f(value: number) {
    this.context.uniform1f(this.location, value);
  }
  /**
   * @method uniform2f
   * @param x {number} Horizontal value to assign.
   * @param y {number} Vertical number to assign.
   */
  uniform2f(x: number, y: number) {
    this.context.uniform2f(this.location, x, y);
  }
  /**
   * @method uniform2fv
   * @param data {number[]}
   */
  uniform2fv(data: number[]) {
    this.context.uniform2fv(this.location, data);
  }
  /**
   * @method uniform3fv
   * @param data {number[]}
   */
  uniform3fv(data: number[]) {
    this.context.uniform3fv(this.location, data);
  }
  /**
   * @method uniform4fv
   * @param data {number[]}
   */
  uniform4fv(data: number[]) {
    this.context.uniform4fv(this.location, data);
  }
  /**
   * @method uniformMatrix3fv
   * @param transpose {boolean}
   * @param matrix {Float32Array}
   */
  uniformMatrix3fv(transpose: boolean, matrix: Float32Array) {
    if (!(matrix instanceof Float32Array)) {
      throw new Error("matrix must be a Float32Array.");
    }
    this.context.uniformMatrix3fv(this.location, transpose, matrix);
  }
  /**
   * @method uniformMatrix4fv
   * @param transpose {boolean}
   * @param matrix {Float32Array}
   */
  uniformMatrix4fv(transpose: boolean, matrix: Float32Array) {
    if (!(matrix instanceof Float32Array)) {
      throw new Error("matrix must be a Float32Array.");
    }
    this.context.uniformMatrix4fv(this.location, transpose, matrix);
  }
  /**
   * @method toString
   */
  toString(): string {
    return ["ShaderUniformLocation({name: ", this.name, ", glslType: ", this.glslType + "})"].join('');
  }
}

export = ShaderUniformLocation;
