import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import UniformColor = require('../uniforms/UniformColor');
import UniformVec3 = require('../uniforms/UniformVec3');
import MultiUniformProvider = require('../uniforms/MultiUniformProvider');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Cartesian3 = require('../math/Cartesian3');

let UNIFORM_POINT_LIGHT_COLOR_NAME = Symbolic.UNIFORM_POINT_LIGHT_COLOR;
let UNIFORM_POINT_LIGHT_POSITION_NAME = Symbolic.UNIFORM_POINT_LIGHT_POSITION;

/**
 * Provides a uniform variable representing a point light.
 * @class PointLight
 */
class PointLight implements UniformProvider {
  private uColor: UniformColor;
  private uPosition: UniformVec3;
  private multi: MultiUniformProvider;
  /**
   * @class PointLight
   * @constructor
   */
  constructor() {
    this.uColor = new UniformColor(UNIFORM_POINT_LIGHT_COLOR_NAME, Symbolic.UNIFORM_POINT_LIGHT_COLOR);
    this.uPosition = new UniformVec3(UNIFORM_POINT_LIGHT_POSITION_NAME, Symbolic.UNIFORM_POINT_LIGHT_POSITION);
    this.multi = new MultiUniformProvider([this.uColor, this.uPosition]);
    this.uColor.value = new Color([1.0, 1.0, 1.0]);
    this.uPosition.value = [0, 0, 0];
  }
  set color(value: Color) {
    this.uColor.value = value;
  }
  set position(value: Cartesian3) {
    this.uPosition.value = [value.x, value.y, value.z];
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

export = PointLight;
