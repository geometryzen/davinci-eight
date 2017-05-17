import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { mustBeInteger } from '../checks/mustBeInteger';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';

/**
 *
 */
export class PointSizeFacet implements Facet {
    /**
     *
     */
    public pointSize: number;

    /**
     *
     */
    constructor(pointSize = 2) {
        this.pointSize = mustBeInteger('pointSize', pointSize);
    }

    /**
     * 
     */
    setUniforms(visitor: FacetVisitor): void {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, this.pointSize);
    }
}
