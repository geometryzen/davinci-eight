import { clamp } from '../math/clamp';
import { Coords } from '../math/Coords';
import { isDefined } from '../checks/isDefined';
import { lock, TargetLockedError } from '../core/Lockable';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeLE } from '../checks/mustBeLE';
import { mustBeNumber } from '../checks/mustBeNumber';
import { principalAngle } from './principalAngle';

const COORD_R = 0;
const COORD_G = 1;
const COORD_B = 2;

const rgb255 = function rgb255(red: number, green: number, blue: number): Color {
    const UBYTEMAX = 255;
    return new Color(red / UBYTEMAX, green / UBYTEMAX, blue / UBYTEMAX);
};

/**
 * A mutable type representing a color through its RGB components.
 */
export class Color extends Coords {

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

    constructor(r: number, g: number, b: number) {
        super([r, g, b], false, 3);

        mustBeGE('r', r, 0);
        mustBeLE('r', r, 1);

        mustBeGE('g', g, 0);
        mustBeLE('g', g, 1);

        mustBeGE('b', b, 0);
        mustBeLE('b', b, 1);
    }

    /**
     * The red coordinate (component) of this color.
     */
    get r(): number {
        return this.coords[COORD_R];
    }
    set r(r: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set r');
        }
        this.coords[COORD_R] = clamp(r, 0, 1);
    }
    get red(): number {
        return this.coords[COORD_R];
    }
    set red(red: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set red');
        }
        this.coords[COORD_R] = clamp(red, 0, 1);
    }

    /**
     * The green coordinate (component) of this color.
     */
    get g(): number {
        return this.coords[COORD_G];
    }
    set g(g: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set g');
        }
        this.coords[COORD_G] = clamp(g, 0, 1);
    }
    get green(): number {
        return this.coords[COORD_G];
    }
    set green(green: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set green');
        }
        this.coords[COORD_G] = clamp(green, 0, 1);
    }

    /**
     * The blue coordinate (component) of this color.
     */
    get b(): number {
        return this.coords[COORD_B];
    }
    set b(b: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set b');
        }
        this.coords[COORD_B] = clamp(b, 0, 1);
    }
    get blue(): number {
        return this.coords[COORD_B];
    }
    set blue(blue: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set blue');
        }
        this.coords[COORD_B] = clamp(blue, 0, 1);
    }

    /**
     * Returns a color in which any rgb component whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate is zero.
     * @param n The exponent used to determine which components are set to zero.
     * @returns approx(this)
     */
    public approx(n: number): Color {
        if (this.isLocked()) {
            return lock(this.clone().approx(n));
        }
        else {
            super.approx(n);
            return this;
        }
    }

    /**
     * @returns a mutable instance of this color.
     */
    public clone(): Color {
        return new Color(this.r, this.g, this.b);
    }

    /**
     * Copies the specified color into this Color instance.
     * @param color The color to be copied.
     * @returns
     */
    public copy(color: { r: number; g: number; b: number }): this {
        if (this.isLocked()) {
            throw new TargetLockedError('copy');
        }
        if (isDefined(color)) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
        }
        else {
            // We can choose what to do based upon a global setting?
            this.r = Math.random();
            this.g = Math.random();
            this.b = Math.random();
        }
        return this;
    }

    /**
     * Linearly interpolates from this color to the specified color.
     * @param target The color returned when α = 1.
     * @param α The parameter that determines the composition of the color.
     * @returns this + (target - this) * α
     */
    public lerp(target: { r: number; g: number; b: number }, α: number): Color {
        if (this.isLocked()) {
            return lock(this.clone().lerp(target, α));
        }
        else {
            this.r += (target.r - this.r) * α;
            this.g += (target.g - this.g) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    }

    /**
     * Computes the luminance of this color.
     */
    get luminance(): number {
        return Color.luminance(this.r, this.g, this.b);
    }

    /**
     * 
     */
    public scale(α: number): Color {
        if (this.isLocked()) {
            return lock(this.clone().scale(α));
        }
        else {
            this.r = this.r * α;
            this.g = this.g * α;
            this.b = this.b * α;
            return this;
        }
    }

    public toExponential(fractionDigits?: number): string {
        return this.toString();
    }

    public toFixed(fractionDigits?: number): string {
        return this.toString();
    }

    public toPrecision(precision?: number): string {
        return this.toString();
    }

    /**
     * @returns A string representation of this color.
     */
    public toString(radix?: number): string {
        return "Color(" + this.r.toString(radix) + ", " + this.g.toString(radix) + ", " + this.b.toString(radix) + ")";
    }

    /**
     * @param color The color to be copied.
     * @returns A mutable copy of the specified color.
     */
    public static copy(color: { r: number; g: number; b: number }): Color {
        return new Color(color.r, color.g, color.b);
    }

    /**
     * @param r
     * @param g
     * @param b
     * @returns
     */
    public static luminance(r: number, g: number, b: number): number {
        mustBeNumber('r', r);
        mustBeNumber('g', g);
        mustBeNumber('b', b);
        const pow = Math.pow;
        const γ = 2.2;
        return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
    }

    /**
     * @param coords
     * @returns
     */
    /*
    public static fromCoords(coords: number[]): Color {
        mustBeArray('coords', coords);
        const r = mustBeNumber('r', coords[COORD_R]);
        const g = mustBeNumber('g', coords[COORD_G]);
        const b = mustBeNumber('b', coords[COORD_B]);
        return new Color(r, g, b);
    }
    */

    /**
     * Converts an angle, radius, height to a color on a color wheel.
     *
     * @param H
     * @param S
     * @param L
     * @returns
     */
    public static fromHSL(H: number, S: number, L: number): Color {
        mustBeNumber('H', H);
        mustBeNumber('S', S);
        mustBeNumber('L', L);
        const C = (1 - Math.abs(2 * L - 1)) * S;
        /**
         * This function captures C and L
         */
        function matchLightness(R: number, G: number, B: number): Color {
            // var x = Color.luminance(R, G, B)
            const m = L - 0.5 * C;
            return new Color(R + m, G + m, B + m);
        }
        const sextant = ((principalAngle(H) / Math.PI) * 3) % 6;
        const X = C * (1 - Math.abs(sextant % 2 - 1));
        if (sextant >= 0 && sextant < 1) {
            return matchLightness(C, X/*C*(sextant-0)*/, 0);
        }
        else if (sextant >= 1 && sextant < 2) {
            return matchLightness(X/*C*(2-sextant)*/, C, 0);
        }
        else if (sextant >= 2 && sextant < 3) {
            return matchLightness(0, C, C * (sextant - 2));
        }
        else if (sextant >= 3 && sextant < 4) {
            return matchLightness(0, C * (4 - sextant), C);
        }
        else if (sextant >= 4 && sextant < 5) {
            return matchLightness(X, 0, C);
        }
        else if (sextant >= 5 && sextant < 6) {
            return matchLightness(C, 0, X);
        }
        else {
            return matchLightness(0, 0, 0);
        }
    }

    /**
     * Constructs a new mutable instance of Color from the rgb components.
     * The components are clamped to the range [0, 1].
     * 
     * @param r The red component.
     * @param g The green component.
     * @param b The blue component.
     */
    public static fromRGB(r: number, g: number, b: number): Color {
        mustBeNumber('r', r);
        mustBeNumber('g', g);
        mustBeNumber('b', b);
        return new Color(clamp(r, 0, 1), clamp(g, 0, 1), clamp(b, 0, 1));
    }

    private static isInstance(x: any): x is Color {
        return x instanceof Color;
    }

    /**
     * @param a
     * @param b
     * @param α
     * @returns
     */
    public static lerp(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, α: number): Color {
        return Color.copy(a).lerp(b, clamp(α, 0, 1));
    }

    public static mustBe(name: string, color: Color): Color {
        if (Color.isInstance(color)) {
            return color;
        }
        else {
            throw new Error(`${name} must be a Color.`);
        }
    }

    /**
     * Creates a color in which the red, green, and blue properties lie in the range [0, 1].
     */
    public static random(): Color {
        return Color.fromRGB(Math.random(), Math.random(), Math.random());
    }
}

/**
 *
 */
Color.black = lock(new Color(0, 0, 0));

/**
 *
 */
Color.blue = lock(new Color(0, 0, 1));

/**
 *
 */
Color.green = lock(new Color(0, 1, 0));

/**
 *
 */
Color.cyan = lock(new Color(0, 1, 1));

/**
 *
 */
Color.red = lock(new Color(1, 0, 0));

/**
 *
 */
Color.magenta = lock(new Color(1, 0, 1));

/**
 *
 */
Color.yellow = lock(new Color(1, 1, 0));

/**
 *
 */
Color.white = lock(new Color(1, 1, 1));

/**
 *
 */
Color.gray = lock(new Color(0.5, 0.5, 0.5));

/**
 * 
 */
Color.blueviolet = lock(rgb255(138, 43, 226));

/**
 * 
 */
Color.chartreuse = lock(rgb255(127, 255, 0));

/**
 * 
 */
Color.cobalt = lock(rgb255(61, 89, 171));

/**
 * 
 */
Color.hotpink = lock(rgb255(255, 105, 180));

/**
 * 
 */
Color.lime = lock(rgb255(0, 255, 0));

/**
 * 
 */
Color.slateblue = lock(rgb255(113, 113, 198));

/**
 * 
 */
Color.springgreen = lock(rgb255(0, 255, 127));

/**
 * 
 */
Color.teal = lock(rgb255(56, 142, 142));

