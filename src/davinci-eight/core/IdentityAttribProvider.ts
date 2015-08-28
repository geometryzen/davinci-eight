import AttribMetaInfos = require('../core/AttribMetaInfos');
import AttribProvider = require('../core/AttribProvider');
import DataUsage = require('../core/DataUsage');

class IdentityAttribProvider implements AttribProvider {
  public drawMode;
  public dynamic;
  constructor() {
  }
  draw(context: WebGLRenderingContext): void {
  }
  update(): void {
  }
  getAttribArray(name: string): {usage: DataUsage; data: Float32Array} {
    return;
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
}

export = IdentityAttribProvider;