import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');
import expectArg = require('../checks/expectArg');

class UniformVec3 extends DefaultUniformProvider implements UniformVariable<number[]> {
  private name: string;
  private $data: number[];
  private $callback: () => number[];
  private useData: boolean = false;
  private useCallback = false;
  private id: string;
  constructor(name: string, id?: string) {
    super();
    this.name = name;
    this.id = typeof id !== 'undefined' ? id: uuid4().generate();
  }
  get data() {
    return this.$data;
  }
  set data(data: number[]) {
    this.$data = data;
    if (typeof data !== void 0) {
      expectArg('data', data).toSatisfy(data.length === 3, "data.length must be 3");
      this.useData = true;
      this.useCallback = false;
    }
    else {
      this.useData = false;
      this.$callback = void 0;
    }
  }
  set callback(callback: () => number[]) {
    this.$callback = callback;
    if (typeof callback !== void 0) {
      this.useCallback = true;
      this.useData = false;
    }
    else {
      this.useCallback = false;
      this.$data = void 0;
    }
  }
  getUniformVector3(name: string): number[] {
    switch(name) {
      case this.name: {
        if (this.useData) {
          return this.$data;
        }
        else if (this.useCallback) {
          return this.$callback();
        }
        else {
          let message = "uniform vec3 " + this.name + " has not been assigned a data or callback.";
          console.warn(message);
          throw new Error(message);
        }
      }
      break;
      default: {
        return super.getUniformVector3(name);
      }
    }
  }
  getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMetaInfos();
    uniforms[this.id] = {name: this.name, glslType: 'vec3'};
    return uniforms;
  }
}

export = UniformVec3;
