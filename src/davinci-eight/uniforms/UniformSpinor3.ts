import Spinor3 = require('../math/Spinor3');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../core/DefaultUniformProvider');
import UniformVariable = require('../uniforms/UniformVariable');
import UniformVec4 = require('../uniforms/UniformVec4');

/**
 * Provides a uniform variable representing an ambient light.
 * @class UniformSpinor3
 */
class UniformSpinor3 extends DefaultUniformProvider implements UniformVariable<Spinor3> {
  private inner: UniformVec4;
  /**
   * @class UniformSpinor3
   * @constructor
   */
  constructor(name: string, id?: string) {
    super();
    this.inner = new UniformVec4(name, id);
  }
  get data() {
    let data = this.inner.data;
    if (data) {
      return new Spinor3(data);
    }
    else {
      return;
    }
  }
  set data(vector: Spinor3) {
    this.inner.data = vector.data;
  }
  set callback(callback: () => Spinor3) {
    this.inner.callback = function(): number[] {
      let vector: Spinor3 = callback();
      return vector.data;
    }
  }
  getUniformVector4(name: string): number[] {
    return this.inner.getUniformVector4(name);
  }
  getUniformMeta() {
    return this.inner.getUniformMeta();
  }
}

export = UniformSpinor3;
