import Color = require('../core/Color');
import Symbolic = require('../core/Symbolic');
import UniformColor = require('../uniforms/UniformColor');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import expectArg = require('../checks/expectArg');

/**
 * Default varaible name in GLSL follows naming conventions.
 */
let DEFAULT_UNIFORM_AMBIENT_LIGHT_NAME = 'u' + Symbolic.UNIFORM_AMBIENT_LIGHT;

/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
class AmbientLight implements UniformProvider {
  private $uColor: UniformColor;
  /**
   * @class AmbientLight
   * @constructor
   * @param name {string} The name of the uniform variable. Defaults to Symbolic.UNIFORM_AMBIENT_LIGHT.
   */
  constructor(name: string = DEFAULT_UNIFORM_AMBIENT_LIGHT_NAME) {
    // TODO: Need to have a test for valid variable names in GLSL...
    expectArg('name', name).toBeString().toSatisfy(name.length > 0, "name must have at least one character");
    this.$uColor = new UniformColor(name, Symbolic.UNIFORM_AMBIENT_LIGHT);
    this.uColor.value = new Color([1.0, 1.0, 1.0]);
  }
  get uColor() {
    return this.$uColor;
  }
  set color(value: Color) {
    this.uColor.value = value;
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
  getUniformMetaInfos() {
    return this.uColor.getUniformMetaInfos();
  }
}

export = AmbientLight;
