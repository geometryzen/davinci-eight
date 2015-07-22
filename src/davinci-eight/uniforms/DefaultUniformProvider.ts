import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 * @class DefaultUniformProvider
 */
class DefaultUniformProvider implements UniformProvider {
  /**
   * @class DefaultUniformProvider
   * @constructor
   */
  constructor() {
  }
  /**
   * @method getUniformMatrix3
   */
  getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
    return;
  }
  /**
   * @method getUniformMatrix4
   */
  getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
    return;
  }
  /**
   * @method getUniformVector3
   */
  getUniformVector3(name: string): number[] {
    return;
  }
  /**
   * @method getUniformVector4
   */
  getUniformVector4(name: string): number[] {
    return;
  }
  /**
   * 
   * @method getUniformMetaInfos
   * @return An empty object that derived class may modify.
   */
  getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = {};
    return uniforms;
  }
}

export = DefaultUniformProvider;
