import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import IdentityAttribProvider = require('../core/IdentityAttribProvider');
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
  getAttribMeta(): AttribMetaInfos {
    var attributes: AttribMetaInfos = super.getAttribMeta();
    attributes[Symbolic.ATTRIBUTE_POSITION] = {glslType: 'vec3', size: 3};
    return attributes;
  }
}

export = DefaultAttribProvider;