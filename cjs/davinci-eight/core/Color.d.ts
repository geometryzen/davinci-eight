import ColorRGB = require('../core/ColorRGB');
import Mutable = require('../math/Mutable');
/**
 * A mutable type representing a color through its RGB components.
 * @class Color
 * WARNING: In many object-oriented designs, types representing values are completely immutable.
 * In a graphics library where data changes rapidly and garbage collection might become an issue,
 * it is common to use reference types, such as in this design. This mutability can lead to
 * difficult bugs because it is hard to reason about where a color may have changed.
 */
declare class Color implements ColorRGB, Mutable<number[]> {
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
    luminance(): number;
    toString(): string;
    static luminance(red: number, green: number, blue: number): number;
    /**
     * Converts an angle, radius, height to a color on a color wheel.
     */
    static fromHSL(H: number, S: number, L: number): Color;
    static fromRGB(red: number, green: number, blue: number): Color;
    static copy(color: ColorRGB): Color;
}
export = Color;
