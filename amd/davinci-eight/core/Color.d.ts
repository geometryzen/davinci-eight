import ColorRGB = require('../core/ColorRGB');
import Mutable = require('../math/Mutable');
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
 * @implements ColorRGB
 * @implements Mutable<number[]>
 */
declare class Color implements ColorRGB, Mutable<number[]> {
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
     * @property data
     * @type {number[]}
     */
    data: number[];
    callback: () => number[];
    modified: boolean;
    /**
     * @class Color
     * @constructor
     * @param data {number[]}
     */
    constructor(data?: number[]);
    red: number;
    green: number;
    blue: number;
    clone(): Color;
    interpolate(target: ColorRGB, alpha: number): Color;
    luminance: number;
    toString(): string;
    static luminance(red: number, green: number, blue: number): number;
    /**
     * Converts an angle, radius, height to a color on a color wheel.
     */
    static fromHSL(H: number, S: number, L: number): Color;
    static fromRGB(red: number, green: number, blue: number): Color;
    static copy(color: ColorRGB): Color;
    static interpolate(a: ColorRGB, b: ColorRGB, alpha: number): Color;
}
export = Color;
