import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');
import expectArg = require('../checks/expectArg');

class UniformVec3 extends DefaultUniformProvider implements UniformVariable<number[]> {
  private name: string;
  private $value: number[];
  private $callback: () => number[];
  private useValue: boolean = false;
  private useCallback = false;
  private id: string;
  constructor(name: string, id?: string) {
    super();
    this.name = name;
    this.id = typeof id !== 'undefined' ? id: uuid4().generate();
  }
  get value() {
    return this.$value;
  }
  set value(value: number[]) {
    this.$value = value;
    if (typeof value !== void 0) {
      expectArg('value', value).toSatisfy(value.length === 3, "value.length must be 3");
      this.useValue = true;
      this.useCallback = false;
    }
    else {
      this.useValue = false;
      this.$callback = void 0;
    }
  }
  set callback(callback: () => number[]) {
    this.$callback = callback;
    if (typeof callback !== void 0) {
      this.useCallback = true;
      this.useValue = false;
    }
    else {
      this.useCallback = false;
      this.$value = void 0;
    }
  }
  getUniformVector3(name: string): number[] {
    switch(name) {
      case this.name: {
        if (this.useValue) {
          return this.$value;
        }
        else if (this.useCallback) {
          return this.$callback();
        }
        else {
          let message = "uniform vec3 " + this.name + " has not been assigned a value or callback.";
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
