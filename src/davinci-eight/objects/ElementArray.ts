/// <reference path="../geometries/Geometry.d.ts" />
function computeUsage(geometry: Geometry, context: WebGLRenderingContext): number {
  return geometry.dynamic() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}

/**
 * Manages the (optional) WebGLBuffer used to support gl.drawElements().
 */
class ElementArray {
  private buffer: WebGLBuffer;
  private geometry: Geometry;
  constructor(geometry: Geometry) {
    this.geometry = geometry;
  }
  contextFree(context: WebGLRenderingContext) {
    if (this.buffer) {
      context.deleteBuffer(this.buffer);
      this.buffer = void 0;
    }
  }
  contextGain(context: WebGLRenderingContext) {
    if (this.geometry.hasElements()) {
      this.buffer = context.createBuffer();
    }
  }
  contextLoss() {
    this.buffer = void 0;
  }
  bufferData(context: WebGLRenderingContext, geometry: Geometry) {
    if (this.buffer) {
      var elements = geometry.getElements();
      context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.buffer);
      let usage = computeUsage(geometry, context);
      context.bufferData(context.ELEMENT_ARRAY_BUFFER, elements, usage);
    }
  }
  bind(context: WebGLRenderingContext) {
    if (this.buffer) {
      context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
  }
}

export = ElementArray;