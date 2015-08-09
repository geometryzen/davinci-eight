import Color = require('../core/Color');
import Vector3 = require('../math/Vector3');
import Symbolic = require('../core/Symbolic');
import UniformColor = require('../uniforms/UniformColor');
import UniformVector3 = require('../uniforms/UniformVector3');
import MultiUniformProvider = require('../uniforms/MultiUniformProvider');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Cartesian3 = require('../math/Cartesian3');
import isDefined = require('../checks/isDefined');

/**
 * Provides a uniform variable representing a point light.
 * @class PointLight
 */
class PointLight implements UniformProvider {
  private uColor: UniformColor;
  private uPosition: UniformVector3;
  private multi: MultiUniformProvider;
  /**
   * @class PointLight
   * @constructor
   */
  constructor(options?: {color?: Color; position?: Vector3; name?: string}) {

    options = options || {};
    options.color = options.color || new Color([1.0, 1.0, 1.0]);
    options.position = options.position || new Vector3([0.0, 0.0, 0.0]);

    let colorName = isDefined(options.name) ? options.name + 'Color' : void 0;
    let directionName = isDefined(options.name) ? options.name + 'Direction' : void 0;

    this.uColor = new UniformColor(colorName, Symbolic.UNIFORM_POINT_LIGHT_COLOR);
    this.uPosition = new UniformVector3(directionName, Symbolic.UNIFORM_POINT_LIGHT_POSITION);
    this.multi = new MultiUniformProvider([this.uColor, this.uPosition]);
    this.uColor.data = options.color;
    this.uPosition.data = options.position;
  }
  get color() {
    return this.uColor;
  }
  get position() {
    return this.uPosition;
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
  getUniformMeta() {
    return this.multi.getUniformMeta();
  }
}

export = PointLight;
