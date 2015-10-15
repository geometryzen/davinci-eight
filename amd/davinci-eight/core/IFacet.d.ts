import IAnimationTarget = require('../slideshow/IAnimationTarget');
import IFacetVisitor = require('../core/IFacetVisitor');
/**
 * @class IFacet
 * extends IAnimationTarget
 */
interface IFacet extends IAnimationTarget {
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = IFacet;
