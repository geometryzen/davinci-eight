import IUnknown = require('../core/IUnknown')
import IFacetVisitor = require('../core/IFacetVisitor')

/**
 * @class IFacet
 * extends IUnknown
 */
interface IFacet extends IUnknown {
  /**
   * @method setUniforms
   * @param visitor {IFacetVisitor}
   * @param canvasId {number}
   * @return {void}
   */
  setUniforms(visitor: IFacetVisitor, canvasId: number): void
}

export = IFacet
