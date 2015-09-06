import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import RenderingContextUser = require('../core/RenderingContextUser');

class Texture implements RenderingContextUser {
  private _context: WebGLRenderingContext;
  private _texture: WebGLTexture;
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
    if (this._texture) {
      this._context.deleteTexture(this._texture);
      console.log("WebGLTexture deleted");
      this._texture = void 0;
    }
    this._context = void 0;
  }
  contextGain(context: WebGLRenderingContext) {
    if (this._context !== context) {
      this.contextFree();
      this._context = context;
      this._texture = context.createTexture();
      console.log("WebGLTexture created");
    }
  }
  contextLoss() {
    this._texture = void 0;
    this._context = void 0;
  }
  /**
   * @method bind
   * @parameter target {number}
   */
  bind(target: number) {
    if (this._context) {
      this._context.bindTexture(target, this._texture);
    }
    else {
      console.warn("Texture.bind(target) missing WebGLRenderingContext.");
    }
  }
}

export = Texture;
