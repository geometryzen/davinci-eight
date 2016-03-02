import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 * @module EIGHT
 * @submodule facets
 */

const LOGGING_NAME = 'PointSizeFacet'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class PointSizeFacet
 */
export default class PointSizeFacet implements Facet {

    /**
     * @property pointSize
     * @type {number}
     */
    public pointSize: number;

    /**
     * @class PointSizeFacet
     * @constructor
     * @param [pointSize = 2] {number}
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
