import ColorRGB = require('../core/ColorRGB');
import VectorN = require('../math/VectorN');
/**
 * <p>
 * A mutable type representing a color through its RGB components.
 * </p>
 * <p>
 * WARNING: In many object-oriented designs, types representing values are completely immutable.
 * In a graphics library where data changes rapidly and garbage collection might become an issue,
 * it is common to use reference types, such as in this design. This mutability can lead to
 * difficult bugs because it is hard to reason about where a color may have changed.
 * </p>
 *
 * @class Color
 * @extends VectorN
 * @implements ColorRGB
 */
declare class Color extends VectorN<number> implements ColorRGB {
    /**
     * @property black
     * @type {Color}
     * @static
     */
    static black: Color;
    /**
     * @property blue
     * @type {Color}
     * @static
     */
    static blue: Color;
    /**
     * @property green
     * @type {Color}
     * @static
     */
    static green: Color;
    /**
     * @property cyan
     * @type {Color}
     * @static
     */
    static cyan: Color;
    /**
     * @property red
     * @type {Color}
     * @static
     */
    static red: Color;
    /**
     * @property magenta
     * @type {Color}
     * @static
     */
    static magenta: Color;
    /**
     * @property yellow
     * @type {Color}
     * @static
     */
    static yellow: Color;
    /**
     * @property white
     * @type {Color}
     * @static
     */
    static white: Color;
    /**
     * @class Color
     * @constructor
     * @param data {number[]}
     * @param areYouSure {boolean}
     */
    constructor(r: number, g: number, b: number);
    /**
     * @property r
     * @type {number}
     */
    r: number;
    /**
     * @property g
     * @type {number}
     */
    g: number;
    /**
     * @property b
     * @type {number}
     */
    b: number;
    /**
     * @method clone
     * @return {Color}
     * @chainable
     */
    clone(): Color;
    /**
     * @method copy
     * @param color {ColorRGB}
     * @return {Color}
     * @chainable
     */
    copy(color: ColorRGB): Color;
    /**
     * @method interpolate
     * @param target {ColorRGB}
     * @param α {number}
     * @return {Color}
     * @chainable
     */
    interpolate(target: ColorRGB, α: number): Color;
    /**
     * @property luminance
     * @type {number}
     * @readOnly
     */
    luminance: number;
    /**
     * @method toString
     * @return {string}
     */
    toString(): string;
    /**
     * @method luminance
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @return {number}
     * @static
     */
    static luminance(r: number, g: number, b: number): number;
    /**
     * @method fromColor
     * @param color {ColorRGB}
     * @return {Color}
     * @static
     * @chainable
     */
    static fromColor(color: ColorRGB): Color;
    /**
     * @method fromCoords
     * @param coords {number[]}
     * @return {Color}
     * @chainable
     */
    static fromCoords(coords: number[]): Color;
    /**
     * Converts an angle, radius, height to a color on a color wheel.
     * @method fromHSL
     * @param H {number}
     * @param S {number}
     * @param L {number}
     * @return {Color}
     * @static
     * @chainable
     */
    static fromHSL(H: number, S: number, L: number): Color;
    /**
     * @method fromRGB
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @return {Color}
     * @static
     * @chainable
     */
    static fromRGB(r: number, g: number, b: number): Color;
    /**
     * @method interpolate
     * @param a {ColorRGB}
     * @param b {ColorRGB}
     * @param α {number}
     * @return {Color}
     * @static
     * @chainable
     */
    static interpolate(a: ColorRGB, b: ColorRGB, α: number): Color;
}
export = Color;
