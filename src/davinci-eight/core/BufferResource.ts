import IBuffer = require('../core/IBuffer');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import ContextListener = require('../core/ContextListener');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import refChange = require('../utils/refChange');
import uuid4 = require('../utils/uuid4');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME_IBUFFER = 'IBuffer';

function checkTarget(target: number): number {
  return target;
}

// TODO: Replace this with a functional constructor to prevent tinkering.
class BufferResource implements IBuffer {
  private _buffer: WebGLBuffer;
  private _gl: WebGLRenderingContext;
  private _monitor: ContextMonitor;
  private _refCount: number = 1;
  private _target: number;
  private _uuid: string = uuid4().generate();
  constructor(monitor: ContextMonitor, target: number) {
    this._monitor = expectArg('montor', monitor).toBeObject().value;
    this._target = checkTarget(target);
    refChange(this._uuid, LOGGING_NAME_IBUFFER, +1);
    monitor.addContextListener(this);
  }
  private destructor() {
    if (this._buffer) {
      this._gl.deleteBuffer(this._buffer);
      this._buffer = void 0;
    }
    this._gl = void 0;
    this._monitor.removeContextListener(this);
    this._monitor = void 0;
    this._refCount = void 0;
    this._target = void 0;
    this._uuid = void 0;
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, LOGGING_NAME_IBUFFER, +1);
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, LOGGING_NAME_IBUFFER, -1);
    if (this._refCount === 0) {
      this.destructor();
      return 0;
    }
    else {
      return this._refCount;
    }
  }
  contextFree() {
    if (this._buffer) {
      this._gl.deleteBuffer(this._buffer);
      this._buffer = void 0;
    }
    this._gl = void 0;
  }
  contextGain(manager: ContextManager) {
    // FIXME: Support for multiple contexts. Do I need multiple buffers?
    // Remark. The constructor says I will only be working with one context.
    // However, if that is the case, what if someone adds me to a different context.
    // Answer, I can detect this condition by looking a canvasId.
    // But can I prevent it in the API?
    // I don't think so. That would require typed contexts.
    let gl = manager.gl;
    if (this._gl !== gl) {
      this.contextFree();
      this._gl = gl;
      this._buffer = gl.createBuffer();
    }
  }
  contextLoss() {
    this._buffer = void 0;
    this._gl = void 0;
  }
  /**
   * @method bind
   */
  bind(): void {
    if (this._gl) {
      this._gl.bindBuffer(this._target, this._buffer);
    }
    else {
      console.warn(LOGGING_NAME_IBUFFER + " bind() missing WebGL rendering context.");
    }
  }
  /**
   * @method unbind
   */
  unbind() {
    if (this._gl) {
      this._gl.bindBuffer(this._target, null);
    }
    else {
      console.warn(LOGGING_NAME_IBUFFER + " unbind() missing WebGL rendering context.");
    }

  }
}

export = BufferResource;
