import {FacetVisitor} from './FacetVisitor';

/**
 * A `facet` is an adapter between a domain concept and a `uniform` value parameter in a WebGL shader program.
 * An object implementing the `Facet` interface is capable of setting uniform values on a `FacetVisitor`.
 */
export interface Facet {

    setUniforms(visitor: FacetVisitor): void

    // setProperty(name: string, value: number[]): Facet;
}
