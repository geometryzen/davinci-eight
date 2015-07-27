import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import UniformColor = require('../uniforms/UniformColor');
import UniformVec3 = require('../uniforms/UniformVec3');
import MultiUniformProvider = require('../uniforms/MultiUniformProvider');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Cartesian3 = require('../math/Cartesian3');

let UNIFORM_DIRECTIONAL_LIGHT_COLOR_NAME = Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR;
let UNIFORM_DIRECTIONAL_LIGHT_DIRECTION_NAME = Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION;

/**
 * Provides a uniform variable representing a directional light.
 * @class DirectionalLight
 */
class DirectionalLight implements UniformProvider {
  private $uColor: UniformColor;
  private uDirection: UniformVec3;
  private multi: MultiUniformProvider;
  /**
   * @class DirectionalLight
   * @constructor
   */
  constructor() {
    this.$uColor = new UniformColor(UNIFORM_DIRECTIONAL_LIGHT_COLOR_NAME, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR);
    this.uDirection = new UniformVec3(UNIFORM_DIRECTIONAL_LIGHT_DIRECTION_NAME, Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION);
    this.multi = new MultiUniformProvider([this.uColor, this.uDirection]);
    // Maybe we should just be mutating here?
    this.uColor.value = new Color([1.0, 1.0, 1.0]);
  }
  get uColor() {
    return this.$uColor;
  }
  set color(value: Color) {
    this.uColor.value = value;
  }
  set direction(value: Cartesian3) {
    this.uDirection.value = [value.x, value.y, value.z];
  }
  getUniformFloat(name: string) {
    return this.multi.getUniformFloat(name);
  }
  getUniformMatrix2(name: string) {
    return this.multi.getUniformMatrix2(name);
  }
  getUniformMatrix3(name: string) {
    return this.multi.getUniformMatrix3(name);
  }
  getUniformMatrix4(name: string) {
    return this.multi.getUniformMatrix4(name);
  }
  getUniformVector2(name: string) {
    return this.multi.getUniformVector2(name);
  }
  getUniformVector3(name: string) {
    return this.multi.getUniformVector3(name);
  }
  getUniformVector4(name: string) {
    return this.multi.getUniformVector4(name);
  }
  getUniformMetaInfos() {
    return this.multi.getUniformMetaInfos();
  }
}

export = DirectionalLight;
