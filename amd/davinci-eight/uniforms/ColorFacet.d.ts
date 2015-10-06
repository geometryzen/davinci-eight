import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
import ColorRGB = require('../core/ColorRGB');
import IFacetVisitor = require('../core/IFacetVisitor');
import IProperties = require('../slideshow/IProperties');
/**
 * @class ColorFacet
 */
declare class ColorFacet extends Shareable implements ColorRGB, IFacet, IProperties {
    /**
     * property PROP_RGB
     * @type {string}
     * @static
     */
    static PROP_RGB: string;
    /**
     * property PROP_RED
     * @type {string}
     * @static
     */
    static PROP_RED: string;
    /**
     * @property colorRGB
     * @type Vector3
     * @private
     */
    private data;
    /**
     * @property name
     * @type {string}
     * @private
     */
    private name;
    /**
     * @class ColorFacet
     * @constructor
     * @param [name = Symbolic.UNIFORM_COLOR]
     */
    constructor(name?: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * The red component of the color.
     * @property red
     * @type {number}
     */
    red: number;
    /**
     * The green component of the color.
     * @property green
     * @type {number}
     */
    green: number;
    /**
     * The green component of the color.
     * @property blue
     * @type {number}
     */
    blue: number;
    scale(s: number): ColorFacet;
    setColor(color: ColorRGB): ColorFacet;
    setRGB(red: number, green: number, blue: number): ColorFacet;
    getProperty(name: string): number[];
    setProperty(name: string, data: number[]): void;
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = ColorFacet;
