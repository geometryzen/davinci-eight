import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import AttribProvider = require('../core/AttribProvider');
import DataUsage = require('../core/DataUsage');

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
  getAttribArray(name: string): {usage: DataUsage; data: Float32Array} {
    return;
  }
  getAttribData(): AttribDataInfos {
    var attributes: AttribDataInfos = {};
    return attributes;
  }
  getAttribMeta(): AttribMetaInfos {
    var attributes: AttribMetaInfos = {};
    return attributes;
  }
  hasElementArray(): boolean {
    return false;
  }
  getElementArray(): {usage: DataUsage; data: Uint16Array} {
    return;
  }
  addRef(): void {
  }
  release(): void {
  }
  contextGain(context: WebGLRenderingContext): void {
    this._context = context;
  }
  contextLoss(): void {
    this._context = void 0;
  }
  hasContext(): boolean {
    return !!this._context;
  }
}

export = IdentityAttribProvider;