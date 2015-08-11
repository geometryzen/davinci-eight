import Color = require('../core/Color');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../core/DefaultUniformProvider');
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
  get data() {
    let data = this.inner.data;
    if (data) {
      return new Color(data);
    }
    else {
      return;
    }
  }
  set data(color: Color) {
    this.inner.data = color.data;
  }
  set callback(callback: () => Color) {
    this.inner.callback = function(): number[] {
      let color: Color = callback();
      return color.data;
    }
  }
  getUniformVector3(name: string): number[] {
    return this.inner.getUniformVector3(name);
  }
  getUniformMeta() {
    return this.inner.getUniformMeta();
  }
}

export = UniformColor;
