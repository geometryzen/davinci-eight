import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import IdentityAttribProvider = require('../core/IdentityAttribProvider');
import DataUsage = require('../core/DataUsage');
import DrawMode = require('../core/DrawMode');
import Symbolic = require('../core/Symbolic');

class DefaultAttribProvider extends IdentityAttribProvider {
  constructor() {
    super();
  }
  draw(): void {
  }
  update(): void {
    return super.update();
  }
  getAttribArray(name: string): {usage: DataUsage; data: Float32Array} {
    return super.getAttribArray(name);
  }
  getAttribMeta(): AttribMetaInfos {
    var attributes: AttribMetaInfos = super.getAttribMeta();
    attributes[Symbolic.ATTRIBUTE_POSITION] = {glslType: 'vec3', size: 3};
    return attributes;
  }
  hasElementArray(): boolean {
    return super.hasElementArray();
  }
  getElementArray(): {usage: DataUsage; data: Uint16Array} {
    return super.getElementArray();
  }
}

export = DefaultAttribProvider;