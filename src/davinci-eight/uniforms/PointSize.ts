import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeObject = require('../checks/mustBeObject')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import Symbolic = require('../core/Symbolic')
import R3 = require('../math/R3')

var LOGGING_NAME = 'PointSize'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class PointSize
 */
class PointSize extends Shareable implements IFacet {
    public pointSize: number;
    /**
     * @class PointSize
     * @constructor
     */
    constructor(pointSize: number = 2) {
        super('PointSize')
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
        visitor.uniform1f(Symbolic.UNIFORM_POINT_SIZE, this.pointSize, canvasId)
    }
}

export = PointSize