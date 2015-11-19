import Color = require('../core/Color')
import ColorRGB = require('../core/ColorRGB')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')

var LOGGING_NAME = 'AmbientLight'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class AmbientLight
 * @extends Shareable
 */
class AmbientLight extends Shareable implements IFacet {
    /**
     * @property color
     * @type {Color}
     */
    public color: Color;
    /**
     * Constructs a white light in the -e3 direction.
     * @class AmbientLight
     * @constructor
     */
    constructor(color: ColorRGB) {
        super('AmbientLight')
        mustBeObject('color', color)
        // FIXME: Need some kind of locking for constants
        this.color = Color.white.clone()
        this.color.r = mustBeNumber('color.r', color.r)
        this.color.g = mustBeNumber('color.g', color.g)
        this.color.b = mustBeNumber('color.b', color.b)
    }
    /**
     * @method destructor
     * @type {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }
    getProperty(name: string): number[] {
        return void 0;
    }
    setProperty(name: string, value: number[]): void {
    }
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param [canvasId] {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId?: number): void {
        var coords = [this.color.r, this.color.g, this.color.b]
        visitor.vector3(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, coords, canvasId)
    }
}

export = AmbientLight