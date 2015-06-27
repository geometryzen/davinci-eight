/// <reference path="../geometries/Geometry.d.ts" />
function computeUsage(geometry: Geometry, context: WebGLRenderingContext): number {
  return geometry.dynamic() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}

function existsLocation(location: number): boolean {
  return location >= 0;
}

// TODO: Maybe this should be called simply AttributeArray?
class VertexAttribArray {
  public name: string;
  private size: number;
  private location: number;
  private buffer: WebGLBuffer;
  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
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
      context.vertexAttribPointer(this.location, this.size, context.FLOAT, false, 0, 0);
    }
  }
  bufferData(context: WebGLRenderingContext, geometry: Geometry) {
    if (existsLocation(this.location)) {
      let data = geometry.getVertexAttribArrayData(this.name);
      if (data) {
        context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
        context.bufferData(context.ARRAY_BUFFER, data, computeUsage(geometry, context));
      }
      else {
        throw new Error("Geometry implementation does not support the attribute " + this.name);
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

export = VertexAttribArray;
