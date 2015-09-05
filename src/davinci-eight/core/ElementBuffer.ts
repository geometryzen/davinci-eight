import isDefined = require('../checks/isDefined');
/**
 * Manages the WebGLBuffer used to support gl.drawElements().
 * @class ElementBuffer
 */
class ElementBuffer {
  private _buffer: WebGLBuffer;
  private _context: WebGLRenderingContext;
  private _refCount: number = 0;
  /**
   * @class ElementArray
   * @constructor
   */
  constructor() {
  }
  addRef() {
    this._refCount++;
  }
  release() {
    this._refCount--;
    if (this._refCount === 0) {
      this.contextFree();
    }
  }
  /**
   * @method contextFree
   */
  contextFree() {
    if (this._buffer) {
      this._context.deleteBuffer(this._buffer);
      this._buffer = void 0;
    }
    this._context = void 0;
  }
  /**
   * @method contextGain
   * @param context {WebGLRenderingContext}
   */
  contextGain(context: WebGLRenderingContext) {
    if (this._context !== context) {
      this.contextFree();
      this._context = context;
      this._buffer = context.createBuffer();
    }
  }
  /**
   * @method contextLoss
   */
  contextLoss() {
    this._buffer = void 0;
    this._context = void 0;
  }
  /**
   * @method bind
   */
  bind() {
    if (this._context) {
      this._context.bindBuffer(this._context.ELEMENT_ARRAY_BUFFER, this._buffer);
    }
    else {
      console.warn("ElementBuffer.bind() missing WebGLRenderingContext");
    }
  }
  /**
   * @method data
   * @param data {Uint16Array}
   * @param usage {number} Optional. Defaults to STREAM_DRAW.
   */
  data(data: Uint16Array, usage?: number) {
    if (this._context) {
      usage = isDefined(usage) ? usage : this._context.STREAM_DRAW;
      this._context.bufferData(this._context.ELEMENT_ARRAY_BUFFER, data, usage);
    }
    else {
      console.warn("ElementBuffer.data() missing WebGLRenderingContext");
    }
  }
}

export = ElementBuffer;
