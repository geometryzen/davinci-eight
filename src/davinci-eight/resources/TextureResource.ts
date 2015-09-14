import expectArg = require('../checks/expectArg');
import refChange = require('../utils/refChange');
import Texture = require('../core/Texture');
import ContextListener = require('../core/ContextListener');
import ContextManager = require('../core/ContextManager');
import uuid4 = require('../utils/uuid4');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME_TEXTURE = 'Texture';

class TextureResource implements Texture {
  private _context: WebGLRenderingContext;
  private _monitor: ContextManager;
  private _texture: WebGLTexture;
  private _refCount: number = 1;
  private _uuid: string = uuid4().generate();
  private _target: number;
  constructor(monitor: ContextManager, target: number) {
    this._monitor = expectArg('montor', monitor).toBeObject().value;
    this._target = target;
    refChange(this._uuid, LOGGING_NAME_TEXTURE, +1);
    monitor.addContextListener(this);
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, LOGGING_NAME_TEXTURE, +1);
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, LOGGING_NAME_TEXTURE, -1);
    if (this._refCount === 0) {
      this._monitor.removeContextListener(this);
      this.contextFree();
    }
    return this._refCount;
  }
  contextFree() {
    if (this._texture) {
      this._context.deleteTexture(this._texture);
      this._texture = void 0;
    }
    this._context = void 0;
  }
  contextGain(context: WebGLRenderingContext) {
    if (this._context !== context) {
      this.contextFree();
      this._context = context;
      this._texture = context.createTexture();
    }
  }
  contextLoss() {
    this._texture = void 0;
    this._context = void 0;
  }
  /**
   * @method bind
   */
  bind() {
    if (this._context) {
      this._context.bindTexture(this._target, this._texture);
    }
    else {
      console.warn(LOGGING_NAME_TEXTURE + " bind(target) missing WebGLRenderingContext.");
    }
  }
  /**
   * @method unbind
   */
  unbind() {
    if (this._context) {
      this._context.bindTexture(this._target, null);
    }
    else {
      console.warn(LOGGING_NAME_TEXTURE + " unbind(target) missing WebGLRenderingContext.");
    }
  }
}

export = TextureResource;
