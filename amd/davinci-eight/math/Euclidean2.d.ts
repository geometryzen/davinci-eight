import GeometricElement = require('../math/GeometricElement');
import GeometricOperators = require('../math/GeometricOperators');
import GeometricE2 = require('../math/GeometricE2');
import Measure = require('../math/Measure');
import SpinorE2 = require('../math/SpinorE2');
import TrigMethods = require('../math/TrigMethods');
import Unit = require('../math/Unit');
import VectorE2 = require('../math/VectorE2');
/**
 * @class Euclidean2
 */
declare class Euclidean2 implements Measure<Euclidean2>, GeometricE2, GeometricElement<Euclidean2, Euclidean2, SpinorE2, VectorE2>, GeometricOperators<Euclidean2>, TrigMethods<Euclidean2> {
    private w;
    x: number;
    y: number;
    xy: number;
    uom: Unit;
    /**
     * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean2
     * @constructor
     * @param {number} α The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} β The pseudoscalar part of the multivector.
     * @param uom The optional unit of measure.
     */
    constructor(α: number, x: number, y: number, β: number, uom?: Unit);
    /**
     * The scalar part of this multivector.
     * @property α
     * @return {number}
     */
    α: number;
    /**
     * The pseudoscalar part of this multivector.
     * @property β
     * @return {number}
     */
    β: number;
    fromCartesian(α: number, x: number, y: number, β: number, uom: Unit): Euclidean2;
    fromPolar(α: number, r: number, θ: number, β: number, uom: Unit): Euclidean2;
    coords: number[];
    coordinate(index: number): number;
    static add(a: number[], b: number[]): number[];
    add(rhs: Euclidean2): Euclidean2;
    addPseudo(β: number): Euclidean2;
    addScalar(α: number): Euclidean2;
    adj(): Euclidean2;
    __add__(other: any): Euclidean2;
    __radd__(other: any): Euclidean2;
    /**
     * @method angle
     * @return {Euclidean2}
     */
    angle(): Euclidean2;
    clone(): Euclidean2;
    conj(): Euclidean2;
    cubicBezier(t: number, controlBegin: GeometricE2, controlEnd: GeometricE2, endPoint: GeometricE2): Euclidean2;
    distanceTo(point: GeometricE2): number;
    equals(point: GeometricE2): boolean;
    static sub(a: number[], b: number[]): number[];
    sub(rhs: Euclidean2): Euclidean2;
    __sub__(other: any): Euclidean2;
    __rsub__(other: any): Euclidean2;
    mul(rhs: Euclidean2): Euclidean2;
    __mul__(other: any): Euclidean2;
    __rmul__(other: any): Euclidean2;
    scale(α: number): Euclidean2;
    div(rhs: Euclidean2): Euclidean2;
    divByScalar(α: number): Euclidean2;
    __div__(other: any): Euclidean2;
    __rdiv__(other: any): Euclidean2;
    static scp(a: number[], b: number[]): number[];
    scp(rhs: Euclidean2): Euclidean2;
    static ext(a: number[], b: number[]): number[];
    ext(rhs: Euclidean2): Euclidean2;
    __wedge__(other: any): Euclidean2;
    __rwedge__(other: any): Euclidean2;
    static lshift(a: number[], b: number[]): number[];
    lerp(target: Euclidean2, α: number): Euclidean2;
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
    __bang__(): Euclidean2;
    __pos__(): Euclidean2;
    neg(): Euclidean2;
    __neg__(): Euclidean2;
    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean2;
    grade(grade: number): Euclidean2;
    cos(): Euclidean2;
    cosh(): Euclidean2;
    exp(): Euclidean2;
    inv(): Euclidean2;
    log(): Euclidean2;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    norm(): Euclidean2;
    /**
     * Intentionally undocumented.
     */
    normalize(): Euclidean2;
    quad(): Euclidean2;
    quadraticBezier(t: number, controlPoint: GeometricE2, endPoint: GeometricE2): Euclidean2;
    squaredNorm(): number;
    /**
     * Computes the <em>reflection</em> of this multivector in the plane with normal <code>n</code>.
     * @method reflect
     * @param n {VectorE2}
     * @return {Euclidean2}
     */
    reflect(n: VectorE2): Euclidean2;
    rev(): Euclidean2;
    rotate(R: SpinorE2): Euclidean2;
    sin(): Euclidean2;
    sinh(): Euclidean2;
    slerp(target: Euclidean2, α: number): Euclidean2;
    /**
     * @method tan
     * @return {Euclidean2}
     */
    tan(): Euclidean2;
    unitary(): Euclidean2;
    isOne(): boolean;
    isNaN(): boolean;
    isZero(): boolean;
    toStringCustom(coordToString: (x: number) => string, labels: string[]): string;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
    toStringIJK(): string;
    toStringLATEX(): string;
    /**
     * @method copy
     * @param M {GeometricE2}
     * @return {Euclidean2}
     * @static
     */
    static copy(m: GeometricE2): Euclidean2;
    /**
     * @method fromVectorE2
     * @param vector {VectorE2}
     * @return {Euclidean2}
     * @static
     */
    static fromVectorE2(vector: VectorE2): Euclidean2;
}
export = Euclidean2;
