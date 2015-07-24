import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import UniformColor = require('../uniforms/UniformColor');

let UNIFORM_AMBIENT_LIGHT_NAME = 'uAmbientLight';

/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
class AmbientLight extends UniformColor {
  /**
   * @class AmbientLight
   * @constructor
   */
  constructor(color: Color) {
    super(UNIFORM_AMBIENT_LIGHT_NAME, Symbolic.UNIFORM_AMBIENT_LIGHT);
    this.value = color;
  }
}

export = AmbientLight;
