import Color = require('../core/Color');
import ColorRGB = require('../core/ColorRGB');
import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import Shareable = require('../utils/Shareable');
import R3 = require('../math/R3');
import VectorE3 = require('../math/VectorE3');
/**
 * @class DirectionalLightE3
 * @extends Shareable
 */
declare class DirectionalLightE3 extends Shareable implements IFacet {
    /**
     * The name of the property that designates the color.
     * @property PROP_COLOR
     * @type {string}
     * @default 'color'
     * @static
     * @readOnly
     */
    static PROP_COLOR: string;
    /**
     * The name of the property that designates the direction.
     * @property PROP_DIRECTION
     * @type {string}
     * @default 'direction'
     * @static
     * @readOnly
     */
    static PROP_DIRECTION: string;
    /**
     * @property direction
     * @type {R3}
     */
    direction: R3;
    /**
     * @property color
     * @type {Color}
     */
    color: Color;
    /**
     * @class DirectionalLightE3
     * @constructor
     * @param direction {VectorE3}
     * @param color [ColorRGB = Color.white]
     */
    constructor(direction: VectorE3, color?: ColorRGB);
    /**
     * @method destructor
     * @type {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[];
    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {void}
     */
    setProperty(name: string, value: number[]): void;
    /**
     * @method setColor
     * @param color {ColorRGB}
     * @return {DirectionalLightE3}
     * @chainable
     */
    setColor(color: ColorRGB): DirectionalLightE3;
    /**
     * @method setDirection
     * @param direction {VectorE3}
     * @return {DirectionalLightE3}
     * @chainable
     */
    setDirection(direction: VectorE3): DirectionalLightE3;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param [canvasId] {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId?: number): void;
}
export = DirectionalLightE3;
