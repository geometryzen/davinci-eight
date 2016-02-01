import clamp from '../math/clamp';
import mustBeArray from '../checks/mustBeArray';
import mustBeNumber from '../checks/mustBeNumber';
import principalAngle from '../core/principalAngle';
import ColorRGB from '../core/ColorRGB';
import VectorN from '../math/VectorN';

let pow = Math.pow

let COORD_R = 0
let COORD_G = 1
let COORD_B = 2

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
export default class Color extends VectorN<number> implements ColorRGB {
    /**
     * @property black
     * @type {Color}
     * @static
     */
    public static black = new Color(0, 0, 0);
    /**
     * @property blue
     * @type {Color}
     * @static
     */
    public static blue = new Color(0, 0, 1);
    /**
     * @property green
     * @type {Color}
     * @static
     */
    public static green = new Color(0, 1, 0);
    /**
     * @property cyan
     * @type {Color}
     * @static
     */
    public static cyan = new Color(0, 1, 1);
    /**
     * @property red
     * @type {Color}
     * @static
     */
    public static red = new Color(1, 0, 0);
    /**
     * @property magenta
     * @type {Color}
     * @static
     */
    public static magenta = new Color(1, 0, 1);
    /**
     * @property yellow
     * @type {Color}
     * @static
     */
    public static yellow = new Color(1, 1, 0);
    /**
     * @property white
     * @type {Color}
     * @static
     */
    public static white = new Color(1, 1, 1);

    /**
     * @class Color
     * @constructor
     * @param data {number[]}
     * @param areYouSure {boolean}
     */
    constructor(r: number, g: number, b: number) {
        super([r, g, b], false, 3)
    }

    /**
     * @property r
     * @type {number}
     */
    get r(): number {
        return this.coords[COORD_R]
    }
    set r(r: number) {
        this.coords[COORD_R] = clamp(r, 0, 1)
    }

    /**
     * @property g
     * @type {number}
     */
    get g(): number {
        return this.coords[COORD_G]
    }
    set g(g: number) {
        this.coords[COORD_G] = clamp(g, 0, 1)
    }

    /**
     * @property b
     * @type {number}
     */
    get b(): number {
        return this.coords[COORD_B]
    }
    set b(b: number) {
        this.coords[COORD_B] = clamp(b, 0, 1)
    }

    /**
     * @method clone
     * @return {Color}
     * @chainable
     */
    public clone(): Color {
        return new Color(this.r, this.g, this.b)
    }

    /**
     * @method copy
     * @param color {ColorRGB}
     * @return {Color}
     * @chainable
     */
    public copy(color: ColorRGB): Color {
        this.r = color.r
        this.g = color.g
        this.b = color.b
        return this
    }

    /**
     * @method interpolate
     * @param target {ColorRGB}
     * @param α {number}
     * @return {Color}
     * @chainable
     */
    public interpolate(target: ColorRGB, α: number): Color {
        this.r += (target.r - this.r) * α
        this.g += (target.g - this.g) * α
        this.b += (target.b - this.b) * α
        return this;
    }

    /**
     * @property luminance
     * @type {number}
     * @readOnly
     */
    get luminance(): number {
        return Color.luminance(this.r, this.g, this.b);
    }

    /**
     * @method toString
     * @return {string}
     */
    public toString(): string {
        // FIXME: Use vector stuff
        return "Color(" + this.r + ", " + this.g + ", " + this.b + ")"
    }

    /**
     * @method luminance
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @return {number}
     * @static
     */
    public static luminance(r: number, g: number, b: number): number {
        mustBeNumber('r', r)
        mustBeNumber('g', g)
        mustBeNumber('b', b)
        var γ = 2.2
        return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ)
    }

    /**
     * @method fromColor
     * @param color {ColorRGB}
     * @return {Color}
     * @static
     * @chainable
     */
    public static fromColor(color: ColorRGB): Color {
        return new Color(color.r, color.g, color.b)
    }

    /**
     * @method fromCoords
     * @param coords {number[]}
     * @return {Color}
     * @chainable
     */
    public static fromCoords(coords: number[]): Color {
        mustBeArray('coords', coords)
        var r = mustBeNumber('r', coords[COORD_R])
        var g = mustBeNumber('g', coords[COORD_G])
        var b = mustBeNumber('b', coords[COORD_B])
        return new Color(r, g, b)
    }

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
    public static fromHSL(H: number, S: number, L: number): Color {
        mustBeNumber('H', H)
        mustBeNumber('S', S)
        mustBeNumber('L', L)
        var C = (1 - Math.abs(2 * L - 1)) * S
        /**
         * This function captures C and L
         */
        function matchLightness(R: number, G: number, B: number): Color {
            // var x = Color.luminance(R, G, B)
            var m = L - 0.5 * C
            return new Color(R + m, G + m, B + m)
        }
        var sextant = ((principalAngle(H) / Math.PI) * 3) % 6;
        var X = C * (1 - Math.abs(sextant % 2 - 1));
        if (sextant >= 0 && sextant < 1) {
            return matchLightness(C, X/*C*(sextant-0)*/, 0);
        }
        else if (sextant >= 1 && sextant < 2) {
            return matchLightness(X/*C*(2-sextant)*/, C, 0);
        }
        else if (sextant >= 2 && sextant < 3) {
            return matchLightness(0, C, C * (sextant - 2))
        }
        else if (sextant >= 3 && sextant < 4) {
            return matchLightness(0, C * (4 - sextant), C)
        }
        else if (sextant >= 4 && sextant < 5) {
            return matchLightness(X, 0, C)
        }
        else if (sextant >= 5 && sextant < 6) {
            return matchLightness(C, 0, X)
        }
        else {
            return matchLightness(0, 0, 0)
        }
    }

    /**
     * @method fromRGB
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @return {Color}
     * @static
     * @chainable
     */
    public static fromRGB(r: number, g: number, b: number): Color {
        mustBeNumber('r', r)
        mustBeNumber('g', g)
        mustBeNumber('b', b)
        return new Color(r, g, b)
    }

    /**
     * @method interpolate
     * @param a {ColorRGB}
     * @param b {ColorRGB}
     * @param α {number}
     * @return {Color}
     * @static
     * @chainable
     */
    public static interpolate(a: ColorRGB, b: ColorRGB, α: number): Color {
        return Color.fromColor(a).interpolate(b, α)
    }
}
