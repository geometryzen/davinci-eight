import {FacetVisitor} from './FacetVisitor';

/**
 * A `facet` is an adapter between a domain concept and a `uniform` value parameter in a WebGL shader program.
 * An object implementing the `Facet` interface is capable of setting uniform values on a `FacetVisitor`.
 */
export interface Facet {

    /**
     * @param visitor
     */
    setUniforms(visitor: FacetVisitor): void

    /**
     * @param name
     * @param value
     * @returns
     */
    setProperty(name: string, value: number[]): Facet;
}
