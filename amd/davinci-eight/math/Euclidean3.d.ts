import Measure = require('../math/Measure');
import Unit = require('../math/Unit');
/**
 * The Euclidean3 class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
 * @class Euclidean3
 */
declare class Euclidean3 implements Measure<Euclidean3> {
    /**
     * The `w` property is the grade zero (scalar) part of the Euclidean3 multivector.
     * @property w
     * @type number
     */
    w: number;
    /**
     * The `x` property is the x coordinate of the grade one (vector) part of the Euclidean3 multivector.
     */
    x: number;
    /**
     * The `y` property is the y coordinate of the grade one (vector) part of the Euclidean3 multivector.
     */
    y: number;
    /**
     * The `z` property is the z coordinate of the grade one (vector) part of the Euclidean3 multivector.
     */
    z: number;
    /**
     * The `xy` property is the xy coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     */
    xy: number;
    /**
     * The `yz` property is the yz coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     */
    yz: number;
    /**
     * The `zx` property is the zx coordinate of the grade two (bivector) part of the Euclidean3 multivector.
     */
    zx: number;
    /**
     * The `xyz` property is the grade three (pseudoscalar) part of the Euclidean3 multivector.
     */
    xyz: number;
    /**
     * The optional unit of measure.
     */
    uom: Unit;
    /**
     * Constructs a Euclidean3 from its coordinates.
     * @constructor
     * @param {number} w The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} z The vector component of the multivector in the z-direction.
     * @param {number} xy The bivector component of the multivector in the xy-plane.
     * @param {number} yz The bivector component of the multivector in the yz-plane.
     * @param {number} zx The bivector component of the multivector in the zx-plane.
     * @param {number} xyz The pseudoscalar part of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom?: Unit);
    static fromCartesian(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom: Unit): Euclidean3;
    coordinates(): number[];
    coordinate(index: number): number;
    /**
     * Computes the sum of this Euclidean3 and another considered to be the rhs of the binary addition, `+`, operator.
     * This method does not change this Euclidean3.
     * @method add
     * @param rhs {Euclidean3}
     * @return {Euclidean3} This Euclidean3 plus rhs.
     */
    add(rhs: Euclidean3): Euclidean3;
    __add__(other: any): Euclidean3;
    __radd__(other: any): Euclidean3;
    /**
     * Computes the difference of this Euclidean3 and another considered to be the rhs of the binary subtraction, `-`, operator.
     * This method does not change this Euclidean3.
     * @method sub
     * @param rhs {Euclidean3}
     * @return {Euclidean3} This Euclidean3 minus rhs.
     */
    sub(rhs: Euclidean3): Euclidean3;
    __sub__(other: any): Euclidean3;
    __rsub__(other: any): Euclidean3;
    mul(rhs: Euclidean3): Euclidean3;
    __mul__(other: any): any;
    __rmul__(other: any): any;
    scalarMultiply(rhs: number): Euclidean3;
    div(rhs: Euclidean3): Euclidean3;
    __div__(other: any): Euclidean3;
    __rdiv__(other: any): Euclidean3;
    splat(rhs: Euclidean3): Euclidean3;
    wedge(rhs: Euclidean3): Euclidean3;
    __vbar__(other: any): Euclidean3;
    __rvbar__(other: any): Euclidean3;
    __wedge__(other: any): Euclidean3;
    __rwedge__(other: any): Euclidean3;
    lshift(rhs: Euclidean3): Euclidean3;
    __lshift__(other: any): Euclidean3;
    __rlshift__(other: any): Euclidean3;
    rshift(rhs: Euclidean3): Euclidean3;
    __rshift__(other: any): Euclidean3;
    __rrshift__(other: any): Euclidean3;
    pow(exponent: Euclidean3): Euclidean3;
    __pos__(): Euclidean3;
    __neg__(): Euclidean3;
    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean3;
    grade(index: number): Euclidean3;
    dot(vector: Euclidean3): number;
    cross(vector: Euclidean3): Euclidean3;
    isZero(): boolean;
    length(): number;
    cos(): Euclidean3;
    cosh(): Euclidean3;
    exp(): Euclidean3;
    /**
     * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
     */
    norm(): Euclidean3;
    /**
     * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
     */
    quad(): Euclidean3;
    sin(): Euclidean3;
    sinh(): Euclidean3;
    unit(): Euclidean3;
    scalar(): number;
    sqrt(): Euclidean3;
    toStringCustom(coordToString: (x: number) => string, labels: string[]): string;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
    toStringIJK(): string;
    toStringLATEX(): string;
}
export = Euclidean3;
