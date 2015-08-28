import AttribProvider = require('../core/AttribProvider');
import convertUsage = require('../core/convertUsage');
import DataUsage = require('../core/DataUsage');
import expectArg = require('../checks/expectArg');

function existsLocation(location: number): boolean {
  return location >= 0;
}

/**
 * Utility class for managing a shader attribute variable.
 * While this class may be created directly by the user, it is preferable
 * to use the ShaderAttribLocation instances managed by the ShaderProgram because
 * there will be improved integrity and context loss management.
 * @class ShaderAttribLocation.
 */
class ShaderAttribLocation {
  /**
   * @property name {string} The name of the variable as it appears in the GLSL program. 
   */
  private $name: string;
  /**
   * @property glslType {string} The type of the variable as it appears in the GLSL program. 
   */
  // This property is not actually used right now but is retained for future use and for
  // symmetry with the uniform location abstraction.
  private $glslType: string;
  /**
   * Index of target attribute in the buffer.
   */
  private location: number;
  private context: WebGLRenderingContext;
  private buffer: WebGLBuffer;
  /**
   * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
   * In particular, this class manages buffer allocation, location caching, and data binding.
   * @class ShaderAttribLocation
   * @constructor
   * @param name {string} The name of the variable as it appears in the GLSL program.
   * @param glslType {string} The type of the variable as it appears in the GLSL program.
   */
  constructor(name: string, glslType: string) {
    this.$name = name;
    switch(glslType) {
      case 'float':
      case 'vec2':
      case 'vec3':
      case 'vec4':
      case 'mat2':
      case 'mat3':
      case 'mat4': {
        this.$glslType = glslType;
      }
      break;
      default: {
        // TODO
        throw new Error("Argument glslType in ShaderAttribLocation constructor must be one of float, vec2, vec3, vec4, mat2, mat3, mat4. Got: " + glslType);
      }
    }
  }
  get name(): string {
    return this.$name;
  }
  contextFree() {
    if (this.buffer) {
      this.context.deleteBuffer(this.buffer);
      this.contextLoss();
    }
  }
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    expectArg('context', context).toBeObject();
    expectArg('program', program).toBeObject();
    this.location = context.getAttribLocation(program, this.name);
    this.context = context;
    if (existsLocation(this.location)) {
      this.buffer = context.createBuffer();
    }
  }
  contextLoss() {
    this.location = void 0;
    this.buffer = void 0;
    this.context = void 0;
  }
  /**
   * @method dataFormat
   * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
   * @param type {number} Specifies the data type of each component in the array. gl.FLOAT (default) or gl.FIXED.
   * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
   */
  dataFormat(size: number, type: number, normalized: boolean = false, stride: number = 0, offset: number = 0) {
    if (existsLocation(this.location)) {
      // TODO: We could assert that we have a buffer.
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
      // 6.14 Fixed point support.
      // The WebGL API does not support the GL_FIXED data type.
      // Consequently, we hard-code the FLOAT constant.
      this.context.vertexAttribPointer(this.location, size, type, normalized, stride, offset);
    }
  }
  /**
   * FIXME This should not couple to an AttribProvider.
   * @method bufferData
   */
  bufferData(data: Float32Array, usage: DataUsage) {
    if (existsLocation(this.location)) {
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
      this.context.bufferData(this.context.ARRAY_BUFFER, data, convertUsage(usage, this.context));
    }
  }
  enable() {
    if (existsLocation(this.location)) {
      this.context.enableVertexAttribArray(this.location);
    }
  }
  disable() {
    if (existsLocation(this.location)) {
      this.context.disableVertexAttribArray(this.location);
    }
  }
  /**
   * @method toString
   */
  toString(): string {
    return ["ShaderAttribLocation({name: ", this.name, ", glslType: ", this.$glslType + "})"].join('');
  }
}

export = ShaderAttribLocation;
