import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeObject from '../checks/mustBeObject';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import Shareable from '../utils/Shareable';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

var LOGGING_NAME = 'PointSizeFacet'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class PointSizeFacet
 */
export default class PointSizeFacet extends Shareable implements Facet {
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
    constructor(pointSize: number = 2) {
        super('PointSizeFacet')
        this.pointSize = mustBeInteger('pointSize', pointSize)
    }
    protected destructor(): void {
        super.destructor()
    }
    getProperty(name: string): number[] {
        return void 0;
    }
    setProperty(name: string, value: number[]): void {
    }
    setUniforms(visitor: FacetVisitor, canvasId: number): void {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, this.pointSize, canvasId)
    }
}
