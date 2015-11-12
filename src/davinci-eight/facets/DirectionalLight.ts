import CartesianE3 = require('../math/CartesianE3')
import Color = require('../core/Color')
import ColorRGB = require('../core/ColorRGB')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import Symbolic = require('../core/Symbolic')
import R3 = require('../math/R3')
import VectorE3 = require('../math/VectorE3')

var LOGGING_NAME = 'DirectionalLight'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class DirectionalLight
 * @extends Shareable
 */
class DirectionalLight extends Shareable implements IFacet {
    /**
     * The name of the property that designates the color.
     * @property PROP_COLOR
     * @type {string}
     * @default 'color'
     * @static
     * @readOnly
     */
    public static PROP_COLOR = 'color';

    /**
     * The name of the property that designates the direction.
     * @property PROP_DIRECTION
     * @type {string}
     * @default 'direction'
     * @static
     * @readOnly
     */
    public static PROP_DIRECTION = 'direction';

    /**
     * @property direction
     * @type {R3}
     */
    public direction: R3;

    /**
     * @property color
     * @type {Color}
     */
    public color: Color;

    /**
     * @class DirectionalLight
     * @constructor
     * @param direction {VectorE3}
     * @param color [ColorRGB = Color.white]
     */
    constructor(direction: VectorE3, color: ColorRGB = Color.white) {
        super('DirectionalLight')
        mustBeObject('direction', direction)
        mustBeObject('color', color)
        this.direction = R3.copy(direction).direction()
        this.color = Color.fromColor(color)
    }

    /**
     * @method destructor
     * @type {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }

    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[] {
        mustBeString('name', name)
        switch (name) {
            case DirectionalLight.PROP_COLOR: {
                return this.color.coords
            }
            case DirectionalLight.PROP_DIRECTION: {
                return this.direction.coords
            }
            default: {
                console.warn("unknown property: " + name)
            }
        }
    }
  
    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {void}
     */
    setProperty(name: string, value: number[]): void {
        mustBeString('name', name)
        mustBeObject('value', value)
        switch (name) {
            case DirectionalLight.PROP_COLOR: {
                this.color.coords = value
                break;
            }
            case DirectionalLight.PROP_DIRECTION: {
                this.direction.coords = value
                break;
            }
            default: {
                console.warn("unknown property: " + name)
            }
        }
    }

    /**
     * @method setColor
     * @param color {ColorRGB}
     * @return {DirectionalLight}
     * @chainable
     */
    setColor(color: ColorRGB): DirectionalLight {
        mustBeObject('color', color)
        this.color.copy(color)
        return this
    }

    /**
     * @method setDirection
     * @param direction {VectorE3}
     * @return {DirectionalLight}
     * @chainable
     */
    setDirection(direction: VectorE3): DirectionalLight {
        mustBeObject('direction', direction)
        this.direction.copy(direction).direction()
        return this
    }

    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void {
        visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.coords, canvasId)
        var coords = [this.color.r, this.color.g, this.color.b]
        visitor.vector3(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, coords, canvasId)
    }
}

export = DirectionalLight