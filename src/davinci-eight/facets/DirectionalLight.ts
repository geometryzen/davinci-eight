import Color from '../core/Color';
import ColorRGB from '../core/ColorRGB';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

/**
 * @module EIGHT
 * @submodule facets
 */

const LOGGING_NAME = 'DirectionalLight'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class DirectionalLight
 */
export default class DirectionalLight implements Facet {
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
     * @type {Vector3}
     */
    public direction: Vector3;

    /**
     * @property color
     * @type {Color}
     */
    public color: Color;

    /**
     * @class DirectionalLight
     * @constructor
     * @param direction {VectorE3}
     * @param color {ColorRGB}
     */
    constructor(direction: VectorE3, color: ColorRGB) {
        mustBeObject('direction', direction)
        mustBeObject('color', color)
        this.direction = Vector3.copy(direction).direction()
        this.color = Color.fromColor(color)
    }

    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[] {
        mustBeString('name', name, contextBuilder)
        switch (name) {
            case DirectionalLight.PROP_COLOR: {
                return this.color.coords;
            }
                break;
            case DirectionalLight.PROP_DIRECTION: {
                return this.direction.coords
            }
                break;
            default: {
                console.warn("unknown property: " + name);
            }
        }
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {DirectionalLight}
     */
    setProperty(name: string, value: number[]): DirectionalLight {
        mustBeString('name', name, contextBuilder);
        mustBeObject('value', value, contextBuilder);
        switch (name) {
            case DirectionalLight.PROP_COLOR: {
                this.color.coords = value;
            }
                break;
            case DirectionalLight.PROP_DIRECTION: {
                this.direction.coords = value;
            }
                break;
            default: {
                console.warn("unknown property: " + name)
            }
        }
        return this;
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
     * @param visitor {FacetVisitor}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void {
        visitor.vector3(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.coords)
        var coords = [this.color.r, this.color.g, this.color.b]
        visitor.vector3(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, coords)
    }
}