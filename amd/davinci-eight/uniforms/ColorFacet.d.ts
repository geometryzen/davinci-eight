import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
import ColorRGB = require('../core/ColorRGB');
import IFacetVisitor = require('../core/IFacetVisitor');
import IAnimationTarget = require('../slideshow/IAnimationTarget');
import IUnknownExt = require('../core/IUnknownExt');
/**
 * @class ColorFacet
 */
declare class ColorFacet extends Shareable implements ColorRGB, IFacet, IAnimationTarget, IUnknownExt<ColorFacet> {
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
     * @type MutableVectorE3
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
    incRef(): ColorFacet;
    decRef(): ColorFacet;
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
