import VertexAttributeProvider = require('../core/VertexAttributeProvider');

function computeUsage(attributes: VertexAttributeProvider, context: WebGLRenderingContext): number {
  return attributes.dynamics() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}

/**
 * Manages the (optional) WebGLBuffer used to support gl.drawElements().
 * @class ElementArray
 */
class ElementArray {
  private buffer: WebGLBuffer;
  private attributes: VertexAttributeProvider;
  private context: WebGLRenderingContext;
  /**
   * @class ElementArray
   * @constructor
   * @param attributes {VertexAttributeProvider}
   */
  constructor(attributes: VertexAttributeProvider) {
    this.attributes = attributes;
  }
  /**
   * @method contextFree
   */
  contextFree() {
    if (this.buffer) {
      this.context.deleteBuffer(this.buffer);
      this.buffer = void 0;
    }
    this.context = void 0;
  }
  /**
   * @method contextGain
   * @param context {WebGLRenderingContext}
   */
  contextGain(context: WebGLRenderingContext) {
    if (this.attributes.hasElements()) {
      this.buffer = context.createBuffer();
    }
    this.context = context;
  }
  /**
   * @method contextLoss
   */
  contextLoss() {
    this.buffer = void 0;
    this.context = void 0;
  }
  /**
   * @method bufferData
   * @param attributes {VertexAttributeProvider}
   */
  bufferData(attributes: VertexAttributeProvider) {
    if (this.buffer) {
      let elements: Uint16Array = attributes.getElements();
      this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
      let usage: number = computeUsage(attributes, this.context);
      this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, elements, usage);
    }
  }
  /**
   * @method bind
   */
  bind() {
    if (this.buffer) {
      this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
  }
}

export = ElementArray;