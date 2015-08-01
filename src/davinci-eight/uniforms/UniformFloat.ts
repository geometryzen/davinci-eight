import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import uuid4 = require('../utils/uuid4');
import UniformVariable = require('../uniforms/UniformVariable');

/**
 * @class UniformFloat
 */
class UniformFloat extends DefaultUniformProvider implements UniformVariable<number> {
  private name: string;
  private $data: number = 0;
  private $callback: () => number;
  private useData: boolean = false;
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
  set data(data: number) {
    this.$data = data;
    if (typeof data !== void 0) {
      this.useData = true;
      this.useCallback = false;
    }
    else {
      this.useData = false;
    }
  }
  set callback(callback: () => number) {
    this.$callback = callback;
    if (typeof callback !== void 0) {
      this.useCallback = true;
      this.useData = false;
    }
    else {
      this.useCallback = false;
    }
  }
  getUniformFloat(name: string): number {
    switch(name) {
      case this.name: {
        if (this.useData) {
          return this.$data;
        }
        else if (this.useCallback) {
          return this.$callback();
        }
        else {
          let message = "uniform float " + this.name + " has not been assigned a data or callback.";
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
  getUniformMeta(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMeta();
    uniforms[this.id] = {name: this.name, glslType: 'float'};
    return uniforms;
  }
}

export = UniformFloat;
