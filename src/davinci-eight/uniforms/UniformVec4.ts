import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');
import expectArg = require('../checks/expectArg');

class UniformVec4 extends DefaultUniformProvider implements UniformVariable<number[]> {
  private name: string;
  private $data: number[] = [0,0,0];
  private $callback: () => number[];
  private useData: boolean = true;
  private id: string;
  constructor(name: string, id?: string) {
    super();
    this.name = name;
    this.id = typeof id !== 'undefined' ? id: uuid4().generate();
  }
  set data(data: number[]) {
    expectArg('data', data).toSatisfy(data.length === 4, "data length must be 4");
    this.$data = data;
    this.useData = true;
  }
  set callback(callback: () => number[]) {
    this.$callback = callback;
    this.useData = false;
  }
  getUniformVector4(name: string): number[] {
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
        return super.getUniformVector4(name);
      }
    }
  }
  getUniformMeta(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMeta();
    uniforms[this.id] = {name: this.name, glslType: 'vec4'};
    return uniforms;
  }
}

export = UniformVec4;
