import Color = require('../core/Color');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformVariable = require('../uniforms/UniformVariable');
import UniformVec4 = require('../uniforms/UniformVec4');

/**
 * Provides a uniform variable representing an ambient light.
 * @class UniformColor
 */
class UniformColor extends DefaultUniformProvider implements UniformVariable<Color> {
  private inner: UniformVec4;
  /**
   * @class UniformColor
   * @constructor
   */
  constructor(name: string, id?: string) {
    super();
    this.inner = new UniformVec4(name, id);
  }
  set value(color: Color) {
    this.inner.value = [color.red, color.green, color.blue, color.alpha];
  }
  set callback(callback: () => Color) {
    this.inner.callback = function(): number[] {
      let color = callback();
      return [color.red, color.green, color.blue];
    }
  }
  getUniformVector4(name: string): number[] {
    return this.inner.getUniformVector4(name);
  }
  getUniformMetaInfos() {
    return this.inner.getUniformMetaInfos();
  }
}

export = UniformColor;
