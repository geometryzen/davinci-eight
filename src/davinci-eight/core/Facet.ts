import FacetVisitor from './FacetVisitor';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class Facet
 */
interface Facet {
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
