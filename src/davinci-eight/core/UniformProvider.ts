import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 * Provides the runtime and design time data required to use a uniform in a vertex shader.
 * @class UniformProvider
 */
interface UniformProvider {
  /**
   * @method getUniformFloat
   */
  getUniformFloat(name: string): number;
  /**
   * @method getUniformMatrix2
   */
  getUniformMatrix2(name: string): {transpose: boolean; matrix2: Float32Array};
  /**
   * @method getUniformMatrix3
   */
  getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array};
  /**
   * @method getUniformMatrix4
   */
  getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array};
  /**
   * @method getUniformVector2
   */
  getUniformVector2(name: string): number[];
  /**
   * @method getUniformVector3
   */
  getUniformVector3(name: string): number[];
  /**
   * @method getUniformVector4
   */
  getUniformVector4(name: string): number[];
  /**
   * @method getUniformMeta
   */
  getUniformMeta(): UniformMetaInfos;
}

export = UniformProvider;