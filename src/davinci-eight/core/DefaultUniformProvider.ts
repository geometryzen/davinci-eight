import UniformProvider = require('../core/UniformProvider');
import UniformDataInfos = require('../core/UniformDataInfos');
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
   * @method getUniformFloat
   */
  getUniformFloat(name: string): number {
    return;
  }
  /**
   * @method getUniformMatrix2
   */
  getUniformMatrix2(name: string): {transpose: boolean; matrix2: Float32Array} {
    return;
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
   * @method getUniformVector2
   */
  getUniformVector2(name: string): number[] {
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
   * @method getUniformMeta
   * @return An empty object that derived class may modify.
   */
  getUniformMeta(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = {};
    return uniforms;
  }
  /**
   * @method getUniformData
   * @return An empty object that derived class may modify.
   */
  getUniformData(): UniformDataInfos {
    let data: UniformDataInfos = {};
    return data;
  }
}

export = DefaultUniformProvider;
