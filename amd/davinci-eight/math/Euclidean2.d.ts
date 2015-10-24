import Measure = require('../math/Measure');
import Unit = require('../math/Unit');
declare class Euclidean2 implements Measure<Euclidean2> {
    w: number;
    x: number;
    y: number;
    xy: number;
    uom: Unit;
    /**
     * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean2
     * @constructor
     * @param {number} w The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} xy The pseudoscalar part of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(w: number, x: number, y: number, xy: number, uom?: Unit);
    fromCartesian(w: number, x: number, y: number, xy: number, uom: Unit): Euclidean2;
    fromPolar(w: number, r: number, theta: number, s: number, uom: Unit): Euclidean2;
    coordinates(): number[];
    coordinate(index: number): number;
    static add(a: number[], b: number[]): number[];
    add(rhs: Euclidean2): Euclidean2;
    __add__(other: any): Euclidean2;
    __radd__(other: any): Euclidean2;
    static sub(a: number[], b: number[]): number[];
    sub(rhs: Euclidean2): Euclidean2;
    __sub__(other: any): Euclidean2;
    __rsub__(other: any): Euclidean2;
    static mul(a: number[], b: number[]): number[];
    mul(rhs: Euclidean2): Euclidean2;
    __mul__(other: any): Euclidean2;
    __rmul__(other: any): Euclidean2;
    scalarMultiply(rhs: number): Euclidean2;
    div(rhs: Euclidean2): Euclidean2;
    __div__(other: any): Euclidean2;
    __rdiv__(other: any): Euclidean2;
    static align(a: number[], b: number[]): number[];
    align(rhs: Euclidean2): Euclidean2;
    static wedge(a: number[], b: number[]): number[];
    wedge(rhs: Euclidean2): Euclidean2;
    __wedge__(other: any): Euclidean2;
    __rwedge__(other: any): Euclidean2;
    static lshift(a: number[], b: number[]): number[];
    lco(rhs: Euclidean2): Euclidean2;
    __lshift__(other: any): Euclidean2;
    __rlshift__(other: any): Euclidean2;
    static rshift(a: number[], b: number[]): number[];
    rco(rhs: Euclidean2): Euclidean2;
    __rshift__(other: any): Euclidean2;
    __rrshift__(other: any): Euclidean2;
    __vbar__(other: any): Euclidean2;
    __rvbar__(other: any): Euclidean2;
    pow(exponent: Euclidean2): Euclidean2;
    __pos__(): Euclidean2;
    __neg__(): Euclidean2;
    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean2;
    grade(index: number): Euclidean2;
    cos(): Euclidean2;
    cosh(): Euclidean2;
    exp(): Euclidean2;
    norm(): Euclidean2;
    quad(): Euclidean2;
    sin(): Euclidean2;
    sinh(): Euclidean2;
    unitary(): Euclidean2;
    /**
     * @method gradeZero
     * @return {number}
     */
    gradeZero(): number;
    isNaN(): boolean;
    toStringCustom(coordToString: (x: number) => string, labels: string[]): string;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
    toStringIJK(): string;
    toStringLATEX(): string;
}
export = Euclidean2;
