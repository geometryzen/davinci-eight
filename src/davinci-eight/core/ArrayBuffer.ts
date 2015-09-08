import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import RenderingContextUser = require('../core/RenderingContextUser');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');

class ArrayBuffer implements RenderingContextUser {
  private _context: WebGLRenderingContext;
  private _monitor: RenderingContextMonitor;
  private _buffer: WebGLBuffer;
  private _refCount: number = 1;
  constructor(monitor: RenderingContextMonitor) {
    this._monitor = expectArg('montor', monitor).toBeObject().value;
  }
  addRef(): number {
    this._refCount++;
    // console.log("ArrayBuffer.addRef() => " + this._refCount);
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    // console.log("ArrayBuffer.release() => " + this._refCount);
    if (this._refCount === 0) {
      this.contextFree();
    }
    return this._refCount;
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
  /**
   * @method bind
   */
  bind(target: number) {
    if (this._context) {
      this._context.bindBuffer(target, this._buffer);
    }
    else {
      console.warn("ArrayBuffer.bind() missing WebGLRenderingContext.");
    }
  }
}

export = ArrayBuffer;
