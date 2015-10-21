import expectArg = require('../checks/expectArg')
import refChange = require('../utils/refChange')
import ITexture = require('../core/ITexture')
import IContextConsumer = require('../core/IContextConsumer')
import IContextProvider = require('../core/IContextProvider')
import IContextMonitor = require('../core/IContextMonitor')
import uuid4 = require('../utils/uuid4')

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME_ITEXTURE = 'ITexture'

let ms = new Array<IContextMonitor>()
let os: IContextMonitor[] = []

class TextureResource implements ITexture {
  private _gl: WebGLRenderingContext
  // FIXME: Support multiple monitors, defensive copy the array.
  private _monitor: IContextMonitor
  private _texture: WebGLTexture
  private _refCount: number = 1
  private _uuid: string = uuid4().generate()
  private _target: number
  constructor(monitors: IContextMonitor[], target: number) {
    // FIXME: Supprt multiple canvas.
    let monitor = monitors[0]
    this._monitor = expectArg('montor', monitor).toBeObject().value
    this._target = target
    refChange(this._uuid, LOGGING_NAME_ITEXTURE, +1)
    monitor.addContextListener(this)
    monitor.synchronize(this)
  }
  addRef(): number {
    this._refCount++
    refChange(this._uuid, LOGGING_NAME_ITEXTURE, +1)
    return this._refCount
  }
  release(): number {
    this._refCount--
    refChange(this._uuid, LOGGING_NAME_ITEXTURE, -1)
    if (this._refCount === 0) {
      this._monitor.removeContextListener(this)
      this.contextFree()
    }
    return this._refCount
  }
  contextFree() {
    // FIXME: I need to know which context.
    if (this._texture) {
      this._gl.deleteTexture(this._texture)
      this._texture = void 0
    }
    this._gl = void 0
  }
  contextGain(manager: IContextProvider) {
    // FIXME: Support multiple canvas.
    let gl = manager.gl
    if (this._gl !== gl) {
      this.contextFree()
      this._gl = gl
      // I must create a texture for each monitor.
      // But I only get gl events one at a time.

      this._texture = gl.createTexture()
    }
  }
  contextLost() {
    // FIXME: I need to know which context.
    this._texture = void 0
    this._gl = void 0
  }
  /**
   * @method bind
   */
  bind() {
    if (this._gl) {
      this._gl.bindTexture(this._target, this._texture)
    }
    else {
      console.warn(LOGGING_NAME_ITEXTURE + " bind() missing WebGL rendering context.")
    }
  }
  /**
   * @method unbind
   */
  unbind() {
    if (this._gl) {
      this._gl.bindTexture(this._target, null)
    }
    else {
      console.warn(LOGGING_NAME_ITEXTURE + " unbind() missing WebGL rendering context.")
    }
  }
}

export = TextureResource
