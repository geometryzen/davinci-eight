import { VectorN } from '../atoms/VectorN';
import { LockableMixin as Lockable } from '../core/Lockable';
import { BivectorE3 } from './BivectorE3';
import { CartesianG3 } from './CartesianG3';
import { Matrix3 } from './Matrix3';
import { Matrix4 } from './Matrix4';
import { SpinorE3 } from './SpinorE3';
import { VectorE3 } from './VectorE3';
/**
 * @hidden
 */
export declare class Vector3 implements CartesianG3, VectorE3, Lockable, VectorN<number> {
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
     * @param a
     * @param b
     */
    static dot(a: VectorE3, b: VectorE3): number;
    /**
     * Initializes the vector to the specified coordinates and modification state.
     * The returned vector is not locked.
     * @param coords Three numbers corresponding to the x, y, and z coordinates. Default is [0, 0, 0].
     * @param modified The modification state. Default is false.
     */
    constructor(coords?: [number, number, number], modified?: boolean);
    get length(): number;
    get modified(): boolean;
    set modified(modified: boolean);
    getComponent(i: number): number;
    /**
     * The coordinate corresponding to the e1 basis vector.
     */
    get x(): number;
    set x(value: number);
    /**
     * The coordinate corresponding to the e2 basis vector.
     */
    get y(): number;
    set y(value: number);
    /**
     * The coordinate corresponding to the e3 basis vector.
     */
    get z(): number;
    set z(value: number);
    /**
     *
     */
    get maskG3(): number;
    set maskG3(unused: number);
    /**
     * <p>
     * <code>this ⟼ this + vector * α</code>
     * </p>
     *
     * @param vector
     * @param α
     * @return <code>this</code>
     * @chainable
     */
    add(vector: VectorE3, α?: number): this;
    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @param σ
     */
    applyMatrix(σ: Matrix3): this;
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeSimplexGeometry.
     *
     * @method applyMatrix4
     * @param σ The 4x4 matrix that pre-multiplies this column vector.
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    applyMatrix4(σ: Matrix4): Vector3;
    /**
     *
     */
    approx(n: number): Vector3;
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     *
     * @method reflect
     * @param n {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): this;
    /**
     * @param R
     * @returns R * this * reverse(R)
     */
    rotate(R: SpinorE3): Vector3;
    /**
     * @method clone
     * @return {Vector3} <code>copy(this)</code>
     */
    clone(): Vector3;
    /**
     * this ⟼ copy(source)
     *
     * @returns copy(this)
     */
    copy(source: VectorE3): this;
    /**
     * Copies the coordinate values into this <code>Vector3</code>.
     *
     * @param coordinates {number[]}
     * @returns
     */
    copyCoordinates(coordinates: number[]): this;
    /**
     * <p>
     * <code>this ⟼ this ✕ v</code>
     * </p>
     *
     * @method cross
     * @param v {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    cross(v: VectorE3): Vector3;
    /**
     * <code>this ⟼ a ✕ b</code>
     *
     * @param a
     * @param b
     * @returns a x b
     */
    cross2(a: VectorE3, b: VectorE3): Vector3;
    /**
     * @method distanceTo
     * @param point {VectorE3}
     * @return {number}
     */
    distanceTo(point: VectorE3): number;
    /**
     * @method quadranceTo
     * @param point {VectorE3}
     * @return {number}
     */
    quadranceTo(point: VectorE3): number;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): this;
    /**
     * @method dot
     * @param v {VectorE3}
     * @return {number}
     */
    dot(v: VectorE3): number;
    /**
     * <p>
     * <code>this ⟼ I * B</code>
     * </p>
     *
     * Sets this vector to the dual of the bivector, B.
     * If changeSign is <code>true</code>, the direction of the resulting vector is reversed.
     *
     * @method dual
     * @param B {SpinorE3}
     * @param changeSign {boolean}
     * @return {Vector3}
     * @chainable
     */
    dual(B: SpinorE3, changeSign: boolean): Vector3;
    /**
     * @method equals
     * @param other {any}
     * @return {boolean}
     */
    equals(other: any): boolean;
    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * @method neg
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    neg(): this;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     *
     * @method lerp
     * @param target {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    lerp(target: VectorE3, α: number): this;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE3, b: VectorE3, α: number): this;
    /**
     * <p>
     * <code>this ⟼ this / norm(this)</code>
     * </p>
     *
     * @method normalize
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    normalize(): Vector3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     *
     * @method scale
     * @param α {number}
     */
    scale(α: number): Vector3;
    /**
     * @method stress
     * @param σ {VectorE3}
     * @return Vector3
     */
    stress(σ: VectorE3): this;
    /**
     * <p>
     * <code>this ⟼ this</code>, with components modified.
     * </p>
     *
     * @method set
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    setXYZ(x: number, y: number, z: number): this;
    /**
     * Returns the (Euclidean) inner product of this vector with itself.
     *
     * @method squaredNorm
     * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
     */
    squaredNorm(): number;
    /**
     * <p>
     * <code>this ⟼ this - v</code>
     * </p>
     *
     * @method sub
     * @param v {VectorE3}
     * @param [α = 1] {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    sub(v: VectorE3, α?: number): Vector3;
    sub2(a: VectorE3, b: VectorE3): Vector3;
    /**
     *
     */
    toArray(): number[];
    /**
     * @param fractionDigits
     * @returns
     */
    toExponential(fractionDigits?: number): string;
    /**
     * @param fractionDigits
     * @returns
     */
    toFixed(fractionDigits?: number): string;
    /**
     * @param precision
     * @returns
     */
    toPrecision(precision?: number): string;
    /**
     * @param radix
     * @returns
     */
    toString(radix?: number): string;
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     */
    zero(): Vector3;
    __add__(rhs: Vector3): Vector3;
    __radd__(lhs: Vector3): Vector3;
    __sub__(rhs: Vector3): Vector3;
    __rsub__(lhs: Vector3): Vector3;
    __mul__(rhs: number): Vector3;
    __rmul__(lhs: number | Matrix3): Vector3;
    __div__(rhs: number): Vector3;
    __rdiv__(lhs: any): Vector3;
    __pos__(): Vector3;
    __neg__(): Vector3;
    /**
     * @method copy
     * @param vector {VectorE3}
     * @return {Vector3}
     * @static
     * @chainable
     */
    static copy(vector: VectorE3): Vector3;
    /**
     * Constructs a vector which is the dual of the supplied bivector, B.
     * The convention used is dual(m) = I * m.
     * If a sign change is desired from this convention, set changeSign to true.
     */
    static dual(B: BivectorE3, changeSign?: boolean): Vector3;
    static e1(): Vector3;
    static e2(): Vector3;
    static e3(): Vector3;
    /**
     *
     */
    static isInstance(x: any): x is Vector3;
    /**
     * @method lerp
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>a + α * (b - a)</code>
     * @static
     * @chainable
     */
    static lerp(a: VectorE3, b: VectorE3, α: number): Vector3;
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     *
     * @method random
     * @return {Vector3}
     * @static
     * @chainable
     */
    static random(): Vector3;
    /**
     * Creates a vector with the specified cartesian coordinates.
     * The returned vector is not locked.
     * The returned vector is not modified.
     * @param x The x-coordinate.
     * @param y The y-coordinate.
     * @param z The z-coordinate.
     */
    static vector(x: number, y: number, z: number): Vector3;
    /**
     * Creates a vector with all cartesian coordinates set to zero.
     * The returned vector is not locked.
     * The returned vector is not modified.
     */
    static zero(): Vector3;
}
