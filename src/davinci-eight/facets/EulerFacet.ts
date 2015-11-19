import readOnly = require('../i18n/readOnly')
import IFacet = require('../core/IFacet')
import Shareable = require('../utils/Shareable')
import IFacetVisitor = require('../core/IFacetVisitor')
import R3 = require('../math/R3')

/**
 * @class EulerFacet
 */
class EulerFacet extends Shareable implements IFacet {
  private _rotation: R3;
  /**
   * @class EulerFacet
   * @constructor
   */
  constructor() {
    super('EulerFacet')
    this._rotation = new R3();
  }
  protected destructor(): void {
    super.destructor()
  }
  getProperty(name: string): number[] {
    return void 0
  }
  setProperty(name: string, value: number[]): void {
  }
  /**
   * @method setUniforms
   * @param visitor {IFacetVisitor}
   * @param [canvasId] {number}
   * @return {void}
   */
  setUniforms(visitor: IFacetVisitor, canvasId?: number): void {
    console.warn("EulerFacet.setUniforms");
  }
  /**
   * @property rotation
   * @type {R3}
   * @readOnly
   */
  get rotation(): R3 {
    return this._rotation;
  }
  set rotation(unused) {
    throw new Error(readOnly('rotation').message);
  }
}

export = EulerFacet;