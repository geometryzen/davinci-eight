import { Color } from '../core/Color';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
/**
 *
 */
export declare class AmbientLight implements Facet {
    /**
     *
     */
    color: Color;
    /**
     *
     */
    constructor(color: {
        r: number;
        g: number;
        b: number;
    });
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
}
