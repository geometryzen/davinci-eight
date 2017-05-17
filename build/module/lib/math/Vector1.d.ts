import { Coords } from '../math/Coords';
import { Matrix1 } from '../math/Matrix1';
import { SpinorE1 } from '../math/SpinorE1';
import { VectorE0 } from '../math/VectorE0';
import { VectorE1 } from '../math/VectorE1';
/**
 * @class Vector1
 */
export declare class Vector1 extends Coords implements VectorE1 {
    /**
     * @class Vector1
     * @constructor
     * @param data {number[]} Default is [0].
     * @param modified {boolean} Default is false.
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    x: number;
    set(x: number): Vector1;
    add(vector: VectorE1, alpha?: number): this;
    add2(a: VectorE1, b: VectorE1): this;
    scp(v: VectorE1): this;
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @method applyMatrix
     * @param σ {Matrix1}
     * @return {Vector1} <code>this</code>
     * @chainable
     */
    applyMatrix(σ: Matrix1): Vector1;
    /**
     * @method approx
     * @param n {number}
     * @return {Vector1}
     * @chainable
     */
    approx(n: number): Vector1;
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    conj(): this;
    copy(v: VectorE1): this;
    det(): number;
    dual(): this;
    exp(): this;
    one(): this;
    inv(): this;
    lco(v: VectorE1): this;
    log(): this;
    mul(v: VectorE1): this;
    norm(): this;
    div(v: VectorE1): this;
    divByScalar(scalar: number): this;
    min(v: VectorE1): this;
    max(v: VectorE1): this;
    floor(): this;
    ceil(): this;
    rev(): this;
    rco(v: VectorE1): this;
    round(): this;
    roundToZero(): this;
    scale(scalar: number): this;
    stress(σ: VectorE1): this;
    sub(v: VectorE1): this;
    subScalar(s: number): this;
    sub2(a: VectorE1, b: VectorE1): Vector1;
    /**
     * @method neg
     * @return {Vector1} <code>this</code>
     */
    neg(): this;
    /**
     * @method distanceTo
     * @param point {VectorE1}
     * @return {number}
     */
    distanceTo(position: VectorE1): number;
    dot(v: VectorE1): number;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    normalize(): Vector1;
    mul2(a: VectorE1, b: VectorE1): this;
    quad(): this;
    squaredNorm(): number;
    quadranceTo(position: VectorE1): number;
    reflect(n: VectorE1): Vector1;
    reflection(n: VectorE0): Vector1;
    rotate(rotor: SpinorE1): Vector1;
    /**
     * this ⟼ this + α * (v - this)</code>
     * @method lerp
     * @param v {VectorE1}
     * @param α {number}
     * @return {MutanbleNumber}
     * @chainable
     */
    lerp(v: VectorE1, α: number): this;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {Vector1}
     * @param b {Vector1}
     * @param α {number}
     * @return {Vector1}
     * @chainable
     */
    lerp2(a: Vector1, b: Vector1, α: number): this;
    equals(v: VectorE1): boolean;
    fromArray(array: number[], offset?: number): this;
    toArray(array?: number[], offset?: number): number[];
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
    /**
     * @method translation
     * @param d {VectorE0}
     * @return {Vector1}
     * @chainable
     */
    translation(d: VectorE0): Vector1;
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): this;
    clone(): Vector1;
    ext(v: VectorE1): this;
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Vector1}
     * @chainable
     */
    zero(): Vector1;
    /**
     * @method random
     * @return {Vector1}
     * @static
     * @chainable
     */
    static random(): Vector1;
    /**
     *
     */
    static zero(): Vector1;
}
