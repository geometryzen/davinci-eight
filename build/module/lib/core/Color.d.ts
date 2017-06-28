import { Coords } from '../math/Coords';
/**
 * A mutable type representing a color through its RGB components.
 */
export declare class Color extends Coords {
    /**
     *
     */
    static black: Color;
    /**
     *
     */
    static blue: Color;
    /**
     *
     */
    static green: Color;
    /**
     *
     */
    static cyan: Color;
    /**
     *
     */
    static red: Color;
    /**
     *
     */
    static magenta: Color;
    /**
     *
     */
    static yellow: Color;
    /**
     *
     */
    static white: Color;
    /**
     *
     */
    static gray: Color;
    /**
     *
     */
    static blueviolet: Color;
    /**
     *
     */
    static chartreuse: Color;
    /**
     *
     */
    static cobalt: Color;
    /**
     *
     */
    static hotpink: Color;
    /**
     *
     */
    static lime: Color;
    /**
     *
     */
    static slateblue: Color;
    /**
     *
     */
    static springgreen: Color;
    /**
     *
     */
    static teal: Color;
    constructor(r: number, g: number, b: number);
    /**
     * The red coordinate (component) of this color.
     */
    r: number;
    red: number;
    /**
     * The green coordinate (component) of this color.
     */
    g: number;
    green: number;
    /**
     * The blue coordinate (component) of this color.
     */
    b: number;
    blue: number;
    /**
     * Returns a color in which any rgb component whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate is zero.
     * @param n The exponent used to determine which components are set to zero.
     * @returns approx(this)
     */
    approx(n: number): Color;
    /**
     * @returns a mutable instance of this color.
     */
    clone(): Color;
    /**
     * Copies the specified color into this Color instance.
     * @param color The color to be copied.
     * @returns
     */
    copy(color: {
        r: number;
        g: number;
        b: number;
    }): this;
    /**
     * Linearly interpolates from this color to the specified color.
     * @param target The color returned when α = 1.
     * @param α The parameter that determines the composition of the color.
     * @returns this + (target - this) * α
     */
    lerp(target: {
        r: number;
        g: number;
        b: number;
    }, α: number): Color;
    /**
     * Computes the luminance of this color.
     */
    readonly luminance: number;
    /**
     *
     */
    scale(α: number): Color;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    /**
     * @returns A string representation of this color.
     */
    toString(radix?: number): string;
    /**
     * @param color The color to be copied.
     * @returns A mutable copy of the specified color.
     */
    static copy(color: {
        r: number;
        g: number;
        b: number;
    }): Color;
    /**
     * @param r
     * @param g
     * @param b
     * @returns
     */
    static luminance(r: number, g: number, b: number): number;
    /**
     * @param coords
     * @returns
     */
    /**
     * Converts an angle, radius, height to a color on a color wheel.
     *
     * @param H
     * @param S
     * @param L
     * @returns
     */
    static fromHSL(H: number, S: number, L: number): Color;
    /**
     * Constructs a new mutable instance of Color from the rgb components.
     * The components are clamped to the range [0, 1].
     *
     * @param r The red component.
     * @param g The green component.
     * @param b The blue component.
     */
    static fromRGB(r: number, g: number, b: number): Color;
    private static isInstance(x);
    /**
     * @param a
     * @param b
     * @param α
     * @returns
     */
    static lerp(a: {
        r: number;
        g: number;
        b: number;
    }, b: {
        r: number;
        g: number;
        b: number;
    }, α: number): Color;
    static mustBe(name: string, color: Color): Color;
    /**
     * Creates a color in which the red, green, and blue properties lie in the range [0, 1].
     */
    static random(): Color;
}
