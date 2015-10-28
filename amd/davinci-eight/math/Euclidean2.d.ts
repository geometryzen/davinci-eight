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
    private xy;
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
    coordinates(): number[];
    coordinate(index: number): number;
    static add(a: number[], b: number[]): number[];
    add(rhs: Euclidean2): Euclidean2;
    addPseudo(β: number): Euclidean2;
    addScalar(α: number): Euclidean2;
    adj(): Euclidean2;
    __add__(other: any): Euclidean2;
    __radd__(other: any): Euclidean2;
    arg(): number;
    conj(): Euclidean2;
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
    __pos__(): Euclidean2;
    neg(): Euclidean2;
    __neg__(): Euclidean2;
    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean2;
    grade(index: number): Euclidean2;
    cos(): Euclidean2;
    cosh(): Euclidean2;
    exp(): Euclidean2;
    inv(): Euclidean2;
    log(): Euclidean2;
    magnitude(): number;
    norm(): Euclidean2;
    quad(): Euclidean2;
    squaredNorm(): number;
    reflect(n: VectorE2): Euclidean2;
    rev(): Euclidean2;
    rotate(R: SpinorE2): Euclidean2;
    sin(): Euclidean2;
    sinh(): Euclidean2;
    slerp(target: Euclidean2, α: number): Euclidean2;
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
}
export = Euclidean2;
