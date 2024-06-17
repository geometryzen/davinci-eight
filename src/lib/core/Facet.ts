import { FacetVisitor } from "./FacetVisitor";
import { Shareable } from "./Shareable";

/**
 * A `facet` is an adapter between a domain concept and a `uniform` value parameter in a WebGL shader program.
 * An object implementing the `Facet` interface is capable of setting uniform values on a `FacetVisitor` (which is
 * usually implemented by a `Material`).
 */
export interface Facet extends Shareable {
    /**
     * Sets one of more uniform values on the `FacetVisitor`.
     * @param visitor A visitor to the `Facet`, usually a `Material` implementation.
     */
    setUniforms(visitor: FacetVisitor): void;
}
