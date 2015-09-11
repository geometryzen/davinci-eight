import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import refChange = require('../utils/refChange');
import RenderingContextUser = require('../core/RenderingContextUser');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
import uuid4 = require('../utils/uuid4');

/**
 * 
 */
// TODO: Probably should embed the target because unlikely we will change target.
class ArrayBuffer implements RenderingContextUser {
  private _context: WebGLRenderingContext;
  private _monitor: RenderingContextMonitor;
  private _buffer: WebGLBuffer;
  private _refCount: number = 1;
  private _uuid: string = uuid4().generate();
  constructor(monitor: RenderingContextMonitor) {
    this._monitor = expectArg('montor', monitor).toBeObject().value;
    refChange(this._uuid, +1, 'ArrayBuffer');
  }
  addRef(): number {
    refChange(this._uuid, +1, 'ArrayBuffer');
    this._refCount++;
    return this._refCount;
  }
  release(): number {
    refChange(this._uuid, -1, 'ArrayBuffer');
    this._refCount--;
    if (this._refCount === 0) {
      this.contextFree();
    }
    return this._refCount;
  }
  contextFree() {
    if (this._buffer) {
      this._context.deleteBuffer(this._buffer);
      this._buffer = void 0;
    }
    this._context = void 0;
  }
  contextGain(context: WebGLRenderingContext) {
    if (this._context !== context) {
      this.contextFree();
      this._context = context;
      this._buffer = context.createBuffer();
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
  /**
   * @method unbind
   */
  unbind(target: number) {
    // Remark: Having unbind may allow us to do some accounting in future.
    if (this._context) {
      this._context.bindBuffer(target, null);
    }
    else {
      console.warn("ArrayBuffer.unbind() missing WebGLRenderingContext.");
    }

  }
}

export = ArrayBuffer;
