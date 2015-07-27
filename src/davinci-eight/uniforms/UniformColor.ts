import Color = require('../core/Color');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformVariable = require('../uniforms/UniformVariable');
import UniformVec3 = require('../uniforms/UniformVec3');

/**
 * Provides a uniform variable representing an ambient light.
 * @class UniformColor
 */
class UniformColor extends DefaultUniformProvider implements UniformVariable<Color> {
  private inner: UniformVec3;
  /**
   * @class UniformColor
   * @constructor
   */
  constructor(name: string, id?: string) {
    super();
    this.inner = new UniformVec3(name, id);
  }
  set value(color: Color) {
    this.inner.value = [color.red, color.green, color.blue];
  }
  set callback(callback: () => Color) {
    this.inner.callback = function(): number[] {
      let color = callback();
      return [color.red, color.green, color.blue];
    }
  }
  getUniformVector3(name: string): number[] {
    return this.inner.getUniformVector3(name);
  }
  getUniformMetaInfos() {
    return this.inner.getUniformMetaInfos();
  }
}

export = UniformColor;
