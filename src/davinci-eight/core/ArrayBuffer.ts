import isDefined = require('../checks/isDefined');
import RenderingContextUser = require('../core/RenderingContextUser');

class ArrayBuffer implements RenderingContextUser {
  private _context: WebGLRenderingContext;
  private _buffer: WebGLBuffer;
  private _refCount: number = 0;
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
  contextFree() {
    if (this._buffer) {
      this._context.deleteBuffer(this._buffer);
      // console.log("WebGLBuffer deleted");
      this._buffer = void 0;
    }
    this._context = void 0;
  }
  contextGain(context: WebGLRenderingContext) {
    if (this._context !== context) {
      this.contextFree();
      this._context = context;
      this._buffer = context.createBuffer();
      // console.log("WebGLBuffer created");
    }
  }
  contextLoss() {
    this._buffer = void 0;
    this._context = void 0;
  }
  hasContext(): boolean {
    return !!this._context;
  }
  /**
   * @method bindBuffer
   */
  bindBuffer() {
    if (this._context) {
      this._context.bindBuffer(this._context.ARRAY_BUFFER, this._buffer);
    }
    else {
      console.warn("ArrayBuffer.bindBuffer() missing WebGLRenderingContext.");
    }
  }
  /**
   * @method bufferData
   * @param data {Float32Array}
   * @param usage {number} Optional. Defaults to DYNAMIC_DRAW.
   */
  bufferData(data: Float32Array, usage?: number) {
    if (this._context) {
      usage = isDefined(usage) ? usage : this._context.DYNAMIC_DRAW;
      this._context.bufferData(this._context.ARRAY_BUFFER, data, usage);
    }
    else {
      console.warn("ArrayBuffer.bufferData() missing WebGLRenderingContext.");
    }
  }
}

export = ArrayBuffer;
