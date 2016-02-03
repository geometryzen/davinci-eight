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

    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {IAnimationTarget}
     * @chainable
     */
    setProperty(name: string, value: number[]): Facet;
}

export default Facet;
