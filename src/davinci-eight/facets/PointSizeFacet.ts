import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeObject = require('../checks/mustBeObject')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')

var LOGGING_NAME = 'PointSizeFacet'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class PointSizeFacet
 */
class PointSizeFacet extends Shareable implements IFacet {
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
    setUniforms(visitor: IFacetVisitor, canvasId: number): void {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, this.pointSize, canvasId)
    }
}

export = PointSizeFacet