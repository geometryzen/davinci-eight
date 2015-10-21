import readOnly = require('../i18n/readOnly')
import IFacet = require('../core/IFacet')
import Shareable = require('../utils/Shareable')
import IFacetVisitor = require('../core/IFacetVisitor')
import MutableVectorE3 = require('../math/MutableVectorE3')

/**
 * @class EulerFacet
 */
class EulerFacet extends Shareable implements IFacet {
  private _rotation: MutableVectorE3;
  /**
   * @class EulerFacet
   * @constructor
   */
  constructor() {
    super('EulerFacet')
    this._rotation = new MutableVectorE3();
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
   * @param canvasId {number}
   * @return {void}
   */
  setUniforms(visitor: IFacetVisitor, canvasId: number): void {
    console.warn("EulerFacet.setUniforms");
  }
  /**
   * @property rotation
   * @type {MutableVectorE3}
   * @readOnly
   */
  get rotation(): MutableVectorE3 {
    return this._rotation;
  }
  set rotation(unused) {
    throw new Error(readOnly('rotation').message);
  }
}

export = EulerFacet;