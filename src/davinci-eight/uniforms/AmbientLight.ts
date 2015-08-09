import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import UniformColor = require('../uniforms/UniformColor');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import isDefined = require('../checks/isDefined');
import expectArg = require('../checks/expectArg');

/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
class AmbientLight implements UniformProvider {
  private uColor: UniformColor;
  /**
   * @class AmbientLight
   * @constructor
   * @param options {{color?: Color; name?: string}}
   */
  constructor(options?: {color?: Color; name?: string}) {

    options = options || {};
    options.color = options.color || new Color([1.0, 1.0, 1.0]);
//    options.name = options.name || Symbolic.UNIFORM_AMBIENT_LIGHT;

//    expectArg('options.name', options.name).toBeString().toSatisfy(options.name.length > 0, "options.name must have at least one character");

    this.uColor = new UniformColor(options.name, Symbolic.UNIFORM_AMBIENT_LIGHT);
    this.uColor.data = options.color;
  }
  get color() {
    return this.uColor;
  }
  set color(color: UniformColor) {
    throw new Error("color is readonly");
  }
  getUniformFloat(name: string) {
    return this.uColor.getUniformFloat(name);
  }
  getUniformMatrix2(name: string) {
    return this.uColor.getUniformMatrix2(name);
  }
  getUniformMatrix3(name: string) {
    return this.uColor.getUniformMatrix3(name);
  }
  getUniformMatrix4(name: string) {
    return this.uColor.getUniformMatrix4(name);
  }
  getUniformVector2(name: string) {
    return this.uColor.getUniformVector2(name);
  }
  getUniformVector3(name: string) {
    return this.uColor.getUniformVector3(name);
  }
  getUniformVector4(name: string) {
    return this.uColor.getUniformVector4(name);
  }
  getUniformMeta() {
    return this.uColor.getUniformMeta();
  }
}

export = AmbientLight;
