import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
/**
 *
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
