import Buffer = require('../core/Buffer');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import refChange = require('../utils/refChange');
import ContextListener = require('../core/ContextListener');
import ContextManager = require('../core/ContextManager');
import uuid4 = require('../utils/uuid4');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME_BUFFER = 'Buffer';

function checkTarget(target: number): number {
  return target;
}

// TODO: Replace this with a functional constructor to prevent tinkering.
class BufferResource implements Buffer {
  private _context: WebGLRenderingContext;
  private _monitor: ContextManager;
  private _buffer: WebGLBuffer;
  private _refCount: number = 1;
  private _uuid: string = uuid4().generate();
  private _target: number;
  constructor(monitor: ContextManager, target: number) {
    this._monitor = expectArg('montor', monitor).toBeObject().value;
    this._target = checkTarget(target);
    refChange(this._uuid, LOGGING_NAME_BUFFER, +1);
    monitor.addContextListener(this);
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, LOGGING_NAME_BUFFER, +1);
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, LOGGING_NAME_BUFFER, -1);
    if (this._refCount === 0) {
      this._monitor.removeContextListener(this);
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
  bind(): void {
    if (this._context) {
      this._context.bindBuffer(this._target, this._buffer);
    }
    else {
      console.warn(LOGGING_NAME_BUFFER + " bind() missing WebGLRenderingContext.");
    }
  }
  /**
   * @method unbind
   */
  unbind() {
    if (this._context) {
      this._context.bindBuffer(this._target, null);
    }
    else {
      console.warn(LOGGING_NAME_BUFFER + " unbind() missing WebGLRenderingContext.");
    }

  }
}

export = BufferResource;
