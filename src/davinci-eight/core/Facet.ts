import IAnimationTarget from '../slideshow/IAnimationTarget';
import FacetVisitor from '../core/FacetVisitor';
import IUnknown from '../core/IUnknown';

/**
 * @class Facet
 * @extends IAnimationTarget
 * @extends IUnknown
 */
// FIXME: Does not need to extend IAnimationTarget
interface Facet extends IAnimationTarget, IUnknown {
    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor, canvasId: number): void
}

export default Facet;
