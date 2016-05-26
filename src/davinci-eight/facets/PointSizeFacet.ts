import {Facet} from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

const LOGGING_NAME = 'PointSizeFacet'

function contextBuilder() {
    return LOGGING_NAME
}

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
     * @param pointSize
     */
    constructor(pointSize = 2) {
        this.pointSize = mustBeInteger('pointSize', pointSize)
    }

    getProperty(name: string): number[] {
        return void 0;
    }

    setProperty(name: string, value: number[]): PointSizeFacet {
        mustBeString('name', name, contextBuilder);
        mustBeArray('value', value, contextBuilder);
        return this;
    }

    setUniforms(visitor: FacetVisitor): void {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, this.pointSize)
    }
}
