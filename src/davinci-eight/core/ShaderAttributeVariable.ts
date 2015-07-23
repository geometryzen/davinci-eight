import AttributeProvider = require('../core/AttributeProvider');

function computeUsage(attributes: AttributeProvider, context: WebGLRenderingContext): number {
  return attributes.dynamics() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}

function existsLocation(location: number): boolean {
  return location >= 0;
}

/**
 * Utility class for managing a shader attribute variable.
 * @class
 */
class ShaderAttributeVariable {
  public name: string;
  public type: string;
  /**
   * The numbe of components for the attribute. Must be 1,2,3 , or 4.
   */
//  private size: number;
//  private normalized: boolean;
//  private stride: number;
//  private offset: number;
  private location: number;
  private context: WebGLRenderingContext;
  private buffer: WebGLBuffer;
  /**
   * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
   * In particular, this class manages buffer allocation, location caching, and data binding.
   * @class ShaderAttributeVariable
   * @constructor
   * @param name {string}
   */
  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
//    this.size = size;
//    this.normalized = normalized;
//    this.stride = stride;
//    this.offset = offset;
  }
  contextFree() {
    if (this.buffer) {
      this.context.deleteBuffer(this.buffer);
      this.contextLoss();
    }
  }
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
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
   * @param size {number}
   * @param normalized {boolean} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param stride {number} Used for WebGLRenderingContext.vertexAttribPointer().
   * @param offset {number} Used for WebGLRenderingContext.vertexAttribPointer().
   */
  dataFormat(size: number, normalized: boolean = false, stride: number = 0, offset: number = 0) {
    if (existsLocation(this.location)) {
      // TODO: We could assert that we have a buffer.
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
      // 6.14 Fixed point support.
      // The WebGL API does not support the GL_FIXED data type.
      // Consequently, we hard-code the FLOAT constant.
      this.context.vertexAttribPointer(this.location, size, this.context.FLOAT, normalized, stride, offset);
    }
  }
  /**
   * FIXME This should not couple to an AttributeProvider.
   * @method bufferData
   */
  bufferData(attributes: AttributeProvider) {
    if (existsLocation(this.location)) {
      let data: Float32Array = attributes.getVertexAttributeData(this.name);
      if (data) {
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, data, computeUsage(attributes, this.context));
      }
      else {
        // We expect this to be detected long before we get here.
        throw new Error("Geometry implementation claims to support but does not provide data for attribute " + this.name);
      }
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
}

export = ShaderAttributeVariable;
