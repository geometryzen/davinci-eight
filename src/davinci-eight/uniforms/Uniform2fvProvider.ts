import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');

class Uniform2fvProvider extends DefaultUniformProvider {
  private name: string;
  private data: ()=> number[];
  private glslType: string;
  private canonicalName: string;
  constructor(name: string, data: ()=> number[], glslType: string = 'vec2', canonicalName?: string) {
    super();
    this.name = name;
    this.data = data;
    this.glslType = glslType;
    this.canonicalName = typeof canonicalName !== 'undefined' ? canonicalName: uuid4().generate();
  }
  getUniformVector2(name: string): number[] {
    switch(name) {
      case this.name: {
        return this.data();
      }
      default: {
        return super.getUniformVector2(name);
      }
    }
    return this.data();
  }
  getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMetaInfos();
    uniforms[this.canonicalName] = {name: this.name, glslType: this.glslType};
    return uniforms;
  }
}

export = Uniform2fvProvider;
