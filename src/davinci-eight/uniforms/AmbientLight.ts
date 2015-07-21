import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');

let UNIFORM_AMBIENT_LIGHT_NAME = 'uAmbientLight';
let UNIFORM_AMBIENT_LIGHT_TYPE = 'vec3';

/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
class AmbientLight extends DefaultUniformProvider {
  public color: Color;
  /**
   * @class AmbientLight
   * @constructor
   */
  constructor(color: Color) {
    super();
    this.color = color;
  }
  getUniformVector3(name: string): number[] {
    switch(name) {
      case UNIFORM_AMBIENT_LIGHT_NAME: {
        return [this.color.red, this.color.green, this.color.blue];
      }
      default: {
        return super.getUniformVector3(name);
      }
    }
  }
  getUniformMetaInfos() {
    let uniforms: UniformMetaInfos = {};
    uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]  = {name: UNIFORM_AMBIENT_LIGHT_NAME, type: UNIFORM_AMBIENT_LIGHT_TYPE};
    return uniforms;
  }
}

export = AmbientLight;
