import readOnly = require('../i18n/readOnly')
import UniformData = require('../core/UniformData')
import UniformDataVisitor = require('../core/UniformDataVisitor')
import Vector3 = require('../math/Vector3')

/**
 * @class EulerModel
 */
class EulerModel implements UniformData {
  private _rotation: Vector3;
  /**
   * @class EulerModel
   * @constructor
   */
  constructor() {
    this._rotation = new Vector3();
  }
  /**
   * @method setUniforms
   * @param visitor {UniformDataVisitor}
   * @param canvasId {number}
   * @return {void}
   */
  setUniforms(visitor: UniformDataVisitor, canvasId: number): void {
    console.warn("EulerModel.setUniforms");
  }
  /**
   * @property rotation
   * @type {Vector3}
   * @readOnly
   */
  get rotation(): Vector3 {
    return this._rotation;
  }
  set rotation(unused) {
    throw new Error(readOnly('rotation').message);
  }
}

export = EulerModel;