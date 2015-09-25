import IBuffer = require('../core/IBuffer')
import expectArg = require('../checks/expectArg')
import isDefined = require('../checks/isDefined')
import IContextConsumer = require('../core/IContextConsumer')
import IContextProvider = require('../core/IContextProvider')
import mustBeBoolean = require('../checks/mustBeBoolean')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import uuid4 = require('../utils/uuid4')

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME_IBUFFER = 'IBuffer'

// TODO: Replace this with a functional constructor to prevent tinkering?
// TODO: Why is this object specific to one context?
class BufferResource extends Shareable implements IBuffer {
  private _buffer: WebGLBuffer
  private manager: IContextProvider
  private _isElements: boolean
  constructor(manager: IContextProvider, isElements: boolean) {
    super(LOGGING_NAME_IBUFFER)
    this.manager = expectArg('montor', manager).toBeObject().value
    this._isElements = mustBeBoolean('isElements', isElements)
    manager.addContextListener(this)
    manager.synchronize(this)
  }
  protected destructor(): void {
    if (this._buffer) {
      this.manager.gl.deleteBuffer(this._buffer)
      this._buffer = void 0
    }
    this.manager.removeContextListener(this)
    this.manager = void 0
    this._isElements = void 0
  }
  contextFree() {
    if (this._buffer) {
      this.manager.gl.deleteBuffer(this._buffer)
      this._buffer = void 0
    }
    else {
      // It's a duplicate, ignore.
    }
  }
  contextGain(manager: IContextProvider) {
    if (this.manager.canvasId === manager.canvasId) {
      if (!this._buffer) {
        this._buffer = manager.gl.createBuffer()
      }
      else {
        // It's a duplicate, ignore the call.
      }
    }
    else {
      console.warn("BufferResource ignoring contextGain for canvasId " + manager.canvasId);
    }
  }
  contextLost() {
    this._buffer = void 0
  }
  /**
   * @method bind
   */
  bind(): void {
    let gl = this.manager.gl
    if (gl) {
      let target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER
      gl.bindBuffer(target, this._buffer)
    }
    else {
      console.warn(LOGGING_NAME_IBUFFER + " bind() missing WebGL rendering context.")
    }
  }
  /**
   * @method unbind
   */
  unbind() {
    let gl = this.manager.gl
    if (gl) {
      let target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER
      gl.bindBuffer(target, null)
    }
    else {
      console.warn(LOGGING_NAME_IBUFFER + " unbind() missing WebGL rendering context.")
    }

  }
}

export = BufferResource
