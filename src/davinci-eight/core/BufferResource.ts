import IBuffer = require('../core/IBuffer');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import ContextListener = require('../core/ContextListener');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import mustBeBoolean = require('../checks/mustBeBoolean');
import refChange = require('../utils/refChange');
import Shareable = require('../utils/Shareable');
import uuid4 = require('../utils/uuid4');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME_IBUFFER = 'IBuffer'

// TODO: Replace this with a functional constructor to prevent tinkering?
// TODO: Why is this object specific to one context?
class BufferResource extends Shareable implements IBuffer {
  private _buffer: WebGLBuffer;
  private _gl: WebGLRenderingContext;
  private _monitor: ContextMonitor;
  private _isElements: boolean;
  constructor(monitor: ContextMonitor, isElements: boolean) {
    super(LOGGING_NAME_IBUFFER)
    this._monitor = expectArg('montor', monitor).toBeObject().value;
    this._isElements = mustBeBoolean('isElements', isElements);
    monitor.addContextListener(this);
  }
  protected destructor(): void {
    if (this._buffer) {
      this._gl.deleteBuffer(this._buffer);
      this._buffer = void 0;
    }
    this._gl = void 0;
    this._monitor.removeContextListener(this);
    this._monitor = void 0;
    this._isElements = void 0;
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
    let gl = this._gl;
    if (gl) {
      let target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
      gl.bindBuffer(target, this._buffer);
    }
    else {
      console.warn(LOGGING_NAME_IBUFFER + " bind() missing WebGL rendering context.");
    }
  }
  /**
   * @method unbind
   */
  unbind() {
    let gl = this._gl;
    if (gl) {
      let target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
      gl.bindBuffer(target, null);
    }
    else {
      console.warn(LOGGING_NAME_IBUFFER + " unbind() missing WebGL rendering context.");
    }

  }
}

export = BufferResource;
