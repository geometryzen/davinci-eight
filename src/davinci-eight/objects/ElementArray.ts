function computeUsage(geometry: Geometry, context: WebGLRenderingContext): number {
  return geometry.dynamic() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}

class ElementArray {
  private buffer: WebGLBuffer;
  constructor() {

  }
  contextFree(context: WebGLRenderingContext) {
    if (this.buffer) {
      context.deleteBuffer(this.buffer);
      this.buffer = void 0;
    }
  }
  contextGain(context: WebGLRenderingContext) {
    this.buffer = context.createBuffer();
  }
  contextLoss() {
    this.buffer = void 0;
  }
  bufferData(context: WebGLRenderingContext, geometry: Geometry) {
    var elements = geometry.getElements();
    if (elements) {
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