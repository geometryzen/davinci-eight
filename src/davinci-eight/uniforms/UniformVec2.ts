import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');

class UniformVec2 extends DefaultUniformProvider implements UniformVariable<number[]> {
  private name: string;
  private $data: number[] = [0,0];
  private $callback: () => number[];
  private useData: boolean = true;
  private id: string;
  constructor(name: string, id?: string) {
    super();
    this.name = name;
    this.id = typeof id !== 'undefined' ? id: uuid4().generate();
  }
  set data(data: number[]) {
    this.$data = data;
    this.useData = true;
  }
  set callback(callback: () => number[]) {
    this.$callback = callback;
    this.useData = false;
  }
  getUniformVector2(name: string): number[] {
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
        return super.getUniformVector2(name);
      }
    }
  }
  getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMetaInfos();
    uniforms[this.id] = {name: this.name, glslType: 'vec2'};
    return uniforms;
  }
}

export = UniformVec2;
