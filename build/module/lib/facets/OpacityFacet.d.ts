import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
/**
 * @hidden
 */
export declare class OpacityFacet implements Facet {
    /**
     *
     */
    opacity: number;
    /**
     *
     */
    constructor(opacity?: number);
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
}
