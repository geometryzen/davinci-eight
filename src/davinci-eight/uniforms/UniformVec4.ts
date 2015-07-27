import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');
import expectArg = require('../checks/expectArg');

class UniformVec4 extends DefaultUniformProvider implements UniformVariable<number[]> {
  private name: string;
  private $value: number[] = [0,0,0];
  private $callback: () => number[];
  private useValue: boolean = true;
  private id: string;
  constructor(name: string, id?: string) {
    super();
    this.name = name;
    this.id = typeof id !== 'undefined' ? id: uuid4().generate();
  }
  set value(value: number[]) {
    expectArg('value', value).toSatisfy(value.length === 4, "value length must be 4");
    this.$value = value;
    this.useValue = true;
  }
  set callback(callback: () => number[]) {
    this.$callback = callback;
    this.useValue = false;
  }
  getUniformVector4(name: string): number[] {
    switch(name) {
      case this.name: {
        if (this.useValue) {
          return this.$value;
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
  getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMetaInfos();
    uniforms[this.id] = {name: this.name, glslType: 'vec4'};
    return uniforms;
  }
}

export = UniformVec4;
