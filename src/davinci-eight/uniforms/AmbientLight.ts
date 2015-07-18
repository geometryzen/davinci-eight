import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import VertexUniformProvider = require('../core/VertexUniformProvider');

let UNIFORM_AMBIENT_LIGHT_NAME = 'uAmbientLight';
let UNIFORM_AMBIENT_LIGHT_TYPE = 'vec3';

/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
class AmbientLight implements VertexUniformProvider {
  public color: Color;
  /**
   * @class AmbientLight
   * @constructor
   */
  constructor(color: Color) {
    this.color = color;
  }
  getUniformVector3(name: string) {
    switch(name) {
      case UNIFORM_AMBIENT_LIGHT_NAME: {
        return new Vector3({x: this.color.red, y: this.color.green, z: this.color.blue});
      }
      default: {
        return null;// base.getUniformVector3(name);
      }
    }
  }
  getUniformMatrix3(name: string) {
    return null;
  }
  getUniformMatrix4(name: string) {
    return null;
  }
  getUniformMetaInfos() {
    let uniforms: UniformMetaInfos = {};
    uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]  = {name: UNIFORM_AMBIENT_LIGHT_NAME, type: UNIFORM_AMBIENT_LIGHT_TYPE};
    return uniforms;
  }
}

export = AmbientLight;
