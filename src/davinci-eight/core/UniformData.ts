import UniformDataVisitor = require('../core/UniformDataVisitor');

/**
 * @interface UniformData
 */
interface UniformData {
  /**
   * @method setUniforms
   * @param visitor {UniformDataVisitor}
   * @param canvasId {number}
   * @return {void}
   */
  setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
}

export = UniformData;
