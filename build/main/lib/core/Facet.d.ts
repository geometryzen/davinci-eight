import { FacetVisitor } from './FacetVisitor';
import { Shareable } from './Shareable';
/**
 * A `facet` is an adapter between a domain concept and a `uniform` value parameter in a WebGL shader program.
 * An object implementing the `Facet` interface is capable of setting uniform values on a `FacetVisitor`.
 */
export interface Facet extends Shareable {
    setUniforms(visitor: FacetVisitor): void;
}
