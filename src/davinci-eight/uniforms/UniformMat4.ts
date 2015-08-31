import DefaultUniformProvider = require('../core/DefaultUniformProvider');
import UniformDataInfo = require('../core/UniformDataInfo');
import UniformDataInfos = require('../core/UniformDataInfos');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');
import isDefined = require('../checks/isDefined');

class UniformMat4 extends DefaultUniformProvider implements UniformVariable<{transpose: boolean; matrix4: Float32Array}> {
  private $name: string;
  private $data: {transpose: boolean; matrix4: Float32Array};
  private $callback: () => {transpose: boolean; matrix4: Float32Array};
  private useData: boolean = true;
  private id: string;
  private $varName: string;
  constructor(name?: string, id?: string) {
    super();
    this.$name = name;
    this.id = typeof id !== 'undefined' ? id: uuid4().generate();
    this.$varName = isDefined(this.$name) ? this.$name : this.id;
  }
  set data(data: {transpose: boolean; matrix4: Float32Array}) {
    this.$data = data;
    this.useData = true;
  }
  set callback(callback: () => {transpose: boolean; matrix4: Float32Array}) {
    this.$callback = callback;
    this.useData = false;
  }
  private getValue(): {transpose: boolean; matrix4: Float32Array} {
    if (this.useData) {
      return this.$data;
    }
    else {
      return this.$callback();
    }
  }
  getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
    switch(name) {
      case this.$varName: {
        if (this.useData) {
          return this.$data;
        }
        else {
          return this.$callback();
        }
      }
      break;
      default: {
        return super.getUniformMatrix4(name);
      }
    }
  }
  getUniformMeta(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMeta();
    if (isDefined(this.$name)) {
      uniforms[this.id] = {name: this.$name, glslType: 'mat4'};
    }
    else {
      uniforms[this.id] = {glslType: 'mat4'};
    }
    return uniforms;
  }
  getUniformData(): UniformDataInfos {
    let data = super.getUniformData();
    let value = this.getValue();
    let m4 = {transpose: value.transpose, matrix3: void 0, matrix4: value.matrix4, uniformZs: void 0};
    if (isDefined(this.$name)) {
      data[this.$name] = m4;
    }
    else {
      data[this.id] = m4;
    }
    return data;
  }
}

export = UniformMat4;
