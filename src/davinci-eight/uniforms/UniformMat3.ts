import DefaultUniformProvider = require('../core/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');

class UniformMat3 extends DefaultUniformProvider implements UniformVariable<{transpose: boolean; matrix3: Float32Array}> {
  private name: string;
  private $data: {transpose: boolean; matrix3: Float32Array};
  private $callback: () => {transpose: boolean; matrix3: Float32Array};
  private useData: boolean = true;
  private id: string;
  constructor(name: string, id?: string) {
    super();
    this.name = name;
    this.id = typeof id !== 'undefined' ? id: uuid4().generate();
  }
  set data(data: {transpose: boolean; matrix3: Float32Array}) {
    this.$data = data;
    this.useData = true;
  }
  set callback(callback: () => {transpose: boolean; matrix3: Float32Array}) {
    this.$callback = callback;
    this.useData = false;
  }
  getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
    switch(name) {
      case this.name: {
        if (this.useData) {
          return this.$data;
        }
        else {
          return this.$callback();
        }
      }
      break;
      default: {
        return super.getUniformMatrix3(name);
      }
    }
  }
  getUniformMeta(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMeta();
    uniforms[this.id] = {name: this.name, glslType: 'mat3'};
    return uniforms;
  }
}

export = UniformMat3;
