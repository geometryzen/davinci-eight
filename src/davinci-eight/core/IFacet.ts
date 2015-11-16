import IAnimationTarget = require('../slideshow/IAnimationTarget')
import IFacetVisitor = require('../core/IFacetVisitor')
import IUnknown = require('../core/IUnknown')

/**
 * @class IFacet
 * @extends IAnimationTarget
 * @extends IUnknown
 */
// FIXME: Does not need to extend IAnimationTarget.
interface IFacet extends IAnimationTarget, IUnknown {
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void
}

export = IFacet
