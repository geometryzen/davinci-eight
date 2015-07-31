import Vector3 = require('../math/Vector3');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformVariable = require('../uniforms/UniformVariable');
import UniformVec3 = require('../uniforms/UniformVec3');

/**
 * Provides a uniform variable representing an ambient light.
 * @class UniformVector3
 */
class UniformVector3 extends DefaultUniformProvider implements UniformVariable<Vector3> {
  private inner: UniformVec3;
  /**
   * @class UniformVector3
   * @constructor
   */
  constructor(name: string, id?: string) {
    super();
    this.inner = new UniformVec3(name, id);
  }
  get data() {
    let data = this.inner.data;
    if (data) {
      return new Vector3(data);
    }
    else {
      return;
    }
  }
  set data(vector: Vector3) {
    this.inner.data = vector.data;
  }
  set callback(callback: () => Vector3) {
    this.inner.callback = function(): number[] {
      let vector: Vector3 = callback();
      return vector.data;
    }
  }
  getUniformVector3(name: string): number[] {
    return this.inner.getUniformVector3(name);
  }
  getUniformMetaInfos() {
    return this.inner.getUniformMetaInfos();
  }
}

export = UniformVector3;