import Color = require('../core/Color');
import MultiUniformProvider = require('../uniforms/MultiUniformProvider');
import Symbolic = require('../core/Symbolic');
import UniformColor = require('../uniforms/UniformColor');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformProvider = require('../core/UniformProvider');
import UniformVector3 = require('../uniforms/UniformVector3');
import Vector3 = require('../math/Vector3');

let DEFAULT_UNIFORM_DIRECTIONAL_LIGHT_NAME = 'u' + Symbolic.UNIFORM_DIRECTIONAL_LIGHT;

/**
 * Provides a uniform variable representing a directional light.
 * @class DirectionalLight
 */
class DirectionalLight implements UniformProvider {
  private uColor: UniformColor;
  private uDirection: UniformVector3;
  private multi: MultiUniformProvider;
  /**
   * @class DirectionalLight
   * @constructor
   */
  constructor(options?: {color?: Color; direction?: Vector3; name?: string}) {

    options = options || {};
    options.color = options.color || new Color([1.0, 1.0, 1.0]);
    options.direction = options.direction || new Vector3([0.0, 0.0, -1.0]);
    options.name = options.name || DEFAULT_UNIFORM_DIRECTIONAL_LIGHT_NAME;

    this.uColor = new UniformColor(options.name + 'Color', Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR);
    this.uDirection = new UniformVector3(options.name + 'Direction', Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION);
    this.multi = new MultiUniformProvider([this.uColor, this.uDirection]);

    this.uColor.data = options.color;
    this.uDirection.data = options.direction;
  }
  get color() {
    return this.uColor;
  }
  get direction() {
    return this.uDirection;
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
