import IBuffer = require('../core/IBuffer')
import isDefined = require('../checks/isDefined')
import IContextConsumer = require('../core/IContextConsumer')
import IContextProvider = require('../core/IContextProvider')
import mustBeBoolean = require('../checks/mustBeBoolean')
import mustBeObject = require('../checks/mustBeObject')
import Shareable = require('../utils/Shareable')

/**
 * Name used for reference count monitoring and logging.
 */
let CLASS_NAME = 'BufferResource'

// TODO: Replace this with a functional constructor to prevent tinkering?
// TODO: Why is this object specific to one context?
class BufferResource extends Shareable implements IBuffer {
  private _buffer: WebGLBuffer;
  private manager: IContextProvider;
  private _isElements: boolean;
  constructor(manager: IContextProvider, isElements: boolean) {
    super(CLASS_NAME)
    this.manager = mustBeObject('manager', manager)
    this._isElements = mustBeBoolean('isElements', isElements)
    manager.addContextListener(this)
    manager.synchronize(this)
  }
  protected destructor(): void {
    this.contextFree(this.manager.canvasId)
    this.manager.removeContextListener(this)
    this.manager = void 0
    this._isElements = void 0
  }
  contextFree(canvasId: number) {
    if (this._buffer) {
      var gl = this.manager.gl
      if (isDefined(gl)) {
        gl.deleteBuffer(this._buffer)
      }
      else {
        console.error(CLASS_NAME + " must leak WebGLBuffer because WebGLRenderingContext is "+ typeof gl)
      }
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
      console.warn(CLASS_NAME + " bind() missing WebGL rendering context.")
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
      console.warn(CLASS_NAME + " unbind() missing WebGL rendering context.")
    }

  }
}

export = BufferResource
