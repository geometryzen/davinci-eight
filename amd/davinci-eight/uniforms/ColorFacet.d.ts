import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
import ColorRGB = require('../core/ColorRGB');
import ColorRGBA = require('../core/ColorRGBA');
import IFacetVisitor = require('../core/IFacetVisitor');
import IAnimationTarget = require('../slideshow/IAnimationTarget');
import IUnknownExt = require('../core/IUnknownExt');
/**
 * @class ColorFacet
 */
declare class ColorFacet extends Shareable implements ColorRGBA, IFacet, IAnimationTarget, IUnknownExt<ColorFacet> {
    /**
     * property PROP_RGB
     * @type {string}
     * @static
     */
    static PROP_RGB: string;
    /**
     * property PROP_RGBA
     * @type {string}
     * @static
     */
    static PROP_RGBA: string;
    /**
     * property PROP_RED
     * @type {string}
     * @static
     */
    static PROP_RED: string;
    /**
     * property PROP_GREEN
     * @type {string}
     * @static
     */
    static PROP_GREEN: string;
    /**
     * property PROP_BLUE
     * @type {string}
     * @static
     */
    static PROP_BLUE: string;
    /**
     * property PROP_ALPHA
     * @type {string}
     * @static
     */
    static PROP_ALPHA: string;
    /**
     * @property xyz
     * @type {number[]}
     * @private
     */
    private xyz;
    /**
     * @property a
     * @type {number}
     * @private
     */
    private a;
    /**
     * The name of the GLSL uniform variable that will be set.
     * @property uAlphaName
     * @type [string]
     */
    uAlphaName: string;
    /**
     * @property uColorName
     * @type [string]
     */
    uColorName: string;
    /**
     * @class ColorFacet
     * @constructor
     */
    constructor();
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
     * @property r
     * @type {number}
     */
    r: number;
    /**
     * The green component of the color.
     * @property g
     * @type {number}
     */
    g: number;
    /**
     * The blue component of the color.
     * @property b
     * @type {number}
     */
    b: number;
    /**
     * The alpha component of the color.
     * @property α
     * @type {number}
     */
    α: number;
    /**
     * @method scaleRGB
     * @param α {number}
     * @return {ColorFacet}
     * @chainable
     */
    scaleRGB(α: number): ColorFacet;
    /**
     * @method scaleRGBA
     * @param α {number}
     * @return {ColorFacet}
     * @chainable
     */
    scaleRGBA(α: number): ColorFacet;
    /**
     * @method setColorRGB
     * @param color {ColorRGB}
     * @return {ColorFacet}
     * @chainable
     */
    setColorRGB(color: ColorRGB): ColorFacet;
    /**
     * @method setColorRGBA
     * @param color {ColorRGBA}
     * @return {ColorFacet}
     * @chainable
     */
    setColorRGBA(color: ColorRGBA): ColorFacet;
    /**
     * @method setRGB
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @return {ColorFacet}
     * @chainable
     */
    setRGB(red: number, green: number, blue: number): ColorFacet;
    /**
     * @method setRGBA
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @param α {number}
     * @return {ColorFacet}
     * @chainable
     */
    setRGBA(red: number, green: number, blue: number, α: number): ColorFacet;
    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[];
    /**
     * @method setProperty
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    setProperty(name: string, data: number[]): void;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = ColorFacet;
