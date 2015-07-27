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
  get value() {
    let value = this.inner.value;
    if (value) {
      return new Color(value);
    }
    else {
      return;
    }
  }
  set value(color: Color) {
    this.inner.value = color.data;
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
  getUniformMetaInfos() {
    return this.inner.getUniformMetaInfos();
  }
}

export = UniformColor;
