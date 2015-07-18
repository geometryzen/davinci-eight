/**
 * @class Color
 */
declare class Color {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    constructor(red: number, green: number, blue: number, alpha?: number);
    luminance(): number;
    toString(): string;
    static luminance(red: number, green: number, blue: number): number;
    /**
     * Converts an angle, radius, height to a color on a color wheel.
     */
    static fromHSL(H: number, S: number, L: number): Color;
}
export = Color;
