import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');

/**
 * @class UniformFloat
 */
class UniformFloat extends DefaultUniformProvider implements UniformVariable<number> {
  private name: string;
  private $value: number = 0;
  private $callback: () => number;
  private useValue: boolean = false;
  private useCallback: boolean = false;
  private id: string;
  /**
   * @class UniformFloat
   * @constructor
   * @param name {string}
   * @param name {id}
   */
  constructor(name: string, id?: string) {
    super();
    this.name = name;
    this.id = typeof id !== 'undefined' ? id: uuid4().generate();
  }
  set value(value: number) {
    this.$value = value;
    if (typeof value !== void 0) {
      this.useValue = true;
      this.useCallback = false;
    }
    else {
      this.useValue = false;
    }
  }
  set callback(callback: () => number) {
    this.$callback = callback;
    if (typeof callback !== void 0) {
      this.useCallback = true;
      this.useValue = false;
    }
    else {
      this.useCallback = false;
    }
  }
  getUniformFloat(name: string): number {
    switch(name) {
      case this.name: {
        if (this.useValue) {
          return this.$value;
        }
        else if (this.useCallback) {
          return this.$callback();
        }
        else {
          let message = "uniform float " + this.name + " has not been assigned a value or callback.";
          console.warn(message);
          throw new Error(message);
        }
      }
      break;
      default: {
        return super.getUniformFloat(name);
      }
    }
  }
  getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMetaInfos();
    uniforms[this.id] = {name: this.name, glslType: 'float'};
    return uniforms;
  }
}

export = UniformFloat;
