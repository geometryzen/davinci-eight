/// <reference path="../geometries/VertexAttributeProvider.d.ts" />
function computeUsage(geometry: VertexAttributeProvider, context: WebGLRenderingContext): number {
  return geometry.dynamics() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}

function existsLocation(location: number): boolean {
  return location >= 0;
}

/**
 * Utility class for managing a shader attribute variable.
 */
class ShaderAttributeVariable {
  public name: string;
  /**
   * The numbe of components for the attribute. Must be 1,2,3 , or 4.
   */
  private size: number;
  private normalized: boolean;
  private stride: number;
  private offset: number;
  private location: number;
  private buffer: WebGLBuffer;
  constructor(name: string, size: number, normalized: boolean, stride: number, offset: number) {
    this.name = name;
    this.size = size;
    this.normalized = normalized;
    this.stride = stride;
    this.offset = offset;
  }
  contextFree(context: WebGLRenderingContext) {
    if (this.buffer) {
      context.deleteBuffer(this.buffer);
      this.contextLoss();
    }
  }
  contextGain(context: WebGLRenderingContext, program: WebGLProgram) {
    this.location = context.getAttribLocation(program, this.name);
    if (existsLocation(this.location)) {
      this.buffer = context.createBuffer();
    }
  }
  contextLoss() {
    this.location = void 0;
    this.buffer = void 0;
  }
  // Not really bind so much as describing
  bind(context: WebGLRenderingContext) {
    if (existsLocation(this.location)) {
      // TODO: We could assert that we have a buffer.
      context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
      // 6.14 Fixed point support.
      // The WebGL API does not support the GL_FIXED data type.
      // Consequently, we hard-code the FLOAT constant.
      context.vertexAttribPointer(this.location, this.size, context.FLOAT, this.normalized, this.stride, this.offset);
    }
  }
  bufferData(context: WebGLRenderingContext, geometry: VertexAttributeProvider) {
    if (existsLocation(this.location)) {
      let data: Float32Array = geometry.getVertexAttributeData(this.name);
      if (data) {
        context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
        context.bufferData(context.ARRAY_BUFFER, data, computeUsage(geometry, context));
      }
      else {
        // We expect this to be detected by the mesh long before we get here.
        throw new Error("Geometry implementation claims to support but does not provide data for attribute " + this.name);
      }
    }
  }
  enable(context: WebGLRenderingContext) {
    if (existsLocation(this.location)) {
      context.enableVertexAttribArray(this.location);
    }
  }
  disable(context: WebGLRenderingContext) {
    if (existsLocation(this.location)) {
      context.disableVertexAttribArray(this.location);
    }
  }
}

export = ShaderAttributeVariable;
