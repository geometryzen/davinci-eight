import { VectorN } from '../atoms/VectorN';
import { LockableMixin as Lockable } from '../core/Lockable';
import { Matrix2 } from '../math/Matrix2';
import { SpinorE2 } from '../math/SpinorE2';
import { VectorE2 } from '../math/VectorE2';
/**
 * @hidden
 */
export declare class Vector2 implements VectorE2, Lockable, VectorN<number> {
    isLocked: () => boolean;
    lock: () => number;
    unlock: (token: number) => void;
    /**
     *
     */
    private coords_;
    /**
     *
     */
    private modified_;
    /**
     * @param coords The x coordinate and y coordinate.
     * @param modified
     */
    constructor(coords?: number[], modified?: boolean);
    get length(): number;
    get modified(): boolean;
    set modified(modified: boolean);
    getComponent(i: number): number;
    /**
     *
     */
    get x(): number;
    set x(value: number);
    /**
     *
     */
    get y(): number;
    set y(value: number);
    /**
     * @param v
     * @param α
     * @returns
     */
    add(v: VectorE2, α?: number): Vector2;
    /**
     * @param a
     * @param b
     * @returns
     */
    add2(a: VectorE2, b: VectorE2): Vector2;
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @method applyMatrix
     * @param σ {Matrix2}
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    applyMatrix(σ: Matrix2): Vector2;
    /**
     * @method approx
     * @param n {number}
     * @return {Vector2}
     * @chainable
     */
    approx(n: number): Vector2;
    /**
     * @method clone
     * @return {Vector2}
     * @chainable
     */
    clone(): Vector2;
    /**
     * @method copy
     * @param v {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    copy(v: VectorE2): Vector2;
    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {VectorE2}
     * @param endPoint {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    cubicBezier(t: number, controlBegin: VectorE2, controlEnd: VectorE2, endPoint: VectorE2): Vector2;
    /**
     * @method distanceTo
     * @param point {VectorE2}
     * @return {number}
     */
    distanceTo(position: VectorE2): number;
    /**
     * @method sub
     * @param v {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    sub(v: VectorE2): Vector2;
    /**
     * @method sub2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    sub2(a: VectorE2, b: VectorE2): Vector2;
    /**
     * @method scale
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    scale(α: number): Vector2;
    /**
     * @method divByScalar
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    divByScalar(α: number): this;
    min(v: VectorE2): this;
    max(v: VectorE2): this;
    floor(): this;
    ceil(): this;
    round(): this;
    roundToZero(): this;
    /**
     * @method neg
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    neg(): this;
    dot(v: VectorE2): number;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    normalize(): Vector2;
    squaredNorm(): number;
    quadranceTo(position: VectorE2): number;
    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {VectorE2}
     * @param endPoint {VectorE2}
     * @return {Vector2}
     */
    quadraticBezier(t: number, controlPoint: VectorE2, endPoint: VectorE2): Vector2;
    reflect(n: VectorE2): Vector2;
    /**
     * @method rotate
     * @param spinor {SpinorE2}
     * @return {Vector2}
     * @chainable
     */
    rotate(spinor: SpinorE2): Vector2;
    /**
     * this ⟼ this + (v - this) * α
     *
     * @method lerp
     * @param v {VectorE2}
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    lerp(v: VectorE2, α: number): Vector2;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     *
     * @method lerp2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE2, b: VectorE2, α: number): Vector2;
    equals(v: VectorE2): boolean;
    /**
     * @method stress
     * @param σ {VectorE2}
     * @return {Vector2}
     */
    stress(σ: VectorE2): this;
    /**
     *
     */
    toArray(): number[];
    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toExponential(fractionDigits?: number): string;
    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string;
    /**
     * @method toPrecision
     * @param [precision] {number}
     * @return {string}
     */
    toPrecision(precision?: number): string;
    /**
     * @method toString
     * @param [radix] {number}
     * @return {string}
     */
    toString(radix?: number): string;
    fromArray(array: number[], offset?: number): this;
    fromAttribute(attribute: {
        itemSize: number;
        array: number[];
    }, index: number, offset?: number): this;
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     */
    zero(): Vector2;
    __neg__(): Vector2;
    /**
     * @method copy
     *
     * @param vector {VectorE2}
     * @return {Vector2}
     * @static
     * @chainable
     */
    static copy(vector: VectorE2): Vector2;
    /**
     * @method lerp
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {Vector2} <code>a + α * (b - a)</code>
     * @static
     * @chainable
     */
    static lerp(a: VectorE2, b: VectorE2, α: number): Vector2;
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    static random(): Vector2;
    static vector(x: number, y: number): Vector2;
    static readonly zero: Vector2;
}
