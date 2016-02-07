import FacetVisitor from './FacetVisitor';
import IUnknown from './IUnknown';

/**
 * @class Facet
 * @extends IUnknown
 */
interface Facet extends IUnknown {
    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void

    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {Facet}
     * @chainable
     */
    setProperty(name: string, value: number[]): Facet;
}

export default Facet;
