import readOnly = require('../i18n/readOnly')
import IFacet = require('../core/IFacet')
import Shareable = require('../utils/Shareable')
import IFacetVisitor = require('../core/IFacetVisitor')
import Vector3 = require('../math/Vector3')

/**
 * @class EulerFacet
 */
class EulerFacet extends Shareable implements IFacet {
  private _rotation: Vector3;
  /**
   * @class EulerFacet
   * @constructor
   */
  constructor() {
    super('EulerFacet')
    this._rotation = new Vector3();
  }
  /**
   * @method setUniforms
   * @param visitor {IFacetVisitor}
   * @param canvasId {number}
   * @return {void}
   */
  setUniforms(visitor: IFacetVisitor, canvasId: number): void {
    console.warn("EulerFacet.setUniforms");
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

export = EulerFacet;