import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import AttribProvider = require('../core/AttribProvider');

class IdentityAttribProvider implements AttribProvider {
  public drawMode;
  public dynamic;
  protected _context: WebGLRenderingContext;
  protected _refCount: number = 1;
  constructor() {
  }
  draw(): void {
  }
  update(): void {
  }
  getAttribData(): AttribDataInfos {
    var attributes: AttribDataInfos = {};
    return attributes;
  }
  getAttribMeta(): AttribMetaInfos {
    var attributes: AttribMetaInfos = {};
    return attributes;
  }
  addRef(): number {
    this._refCount++;
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    if (this._refCount === 0) {
    }
    return this._refCount;
  }
  contextFree(): void {
    this._context = void 0;
  }
  contextGain(context: WebGLRenderingContext): void {
    this._context = context;
  }
  contextLoss(): void {
    this._context = void 0;
  }
}

export = IdentityAttribProvider;