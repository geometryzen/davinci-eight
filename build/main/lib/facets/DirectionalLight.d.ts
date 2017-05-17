import { Color } from '../core/Color';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { Geometric3 } from '../math/Geometric3';
import { VectorE3 } from '../math/VectorE3';
/**
 *
 */
export declare class DirectionalLight implements Facet {
    private readonly direction_;
    private readonly color_;
    constructor(direction?: VectorE3, color?: {
        r: number;
        g: number;
        b: number;
    });
    color: Color;
    direction: Geometric3;
    setUniforms(visitor: FacetVisitor): void;
}
