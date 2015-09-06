import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import AttribProvider = require('../core/AttribProvider');

class IdentityAttribProvider implements AttribProvider {
  public drawMode;
  public dynamic;
  protected _context: WebGLRenderingContext;
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
  addRef(): void {
  }
  release(): void {
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