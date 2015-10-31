import VectorE3 = require('../math/VectorE3');
import Euclidean3 = require('../math/Euclidean3');
import MutableLinearElement = require('../math/MutableLinearElement');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import SpinorE3 = require('../math/SpinorE3');
import VectorN = require('../math/VectorN');
/**
 * @class R3
 * @extends VectorN<number>
 */
declare class R3 extends VectorN<number> implements VectorE3, MutableLinearElement<VectorE3, R3, SpinorE3, VectorE3> {
    /**
     * @property e1
     * @type {Euclidean3}
     * @static
     */
    static e1: Euclidean3;
    /**
     * @property e2
     * @type {Euclidean3}
     * @static
     */
    static e2: Euclidean3;
    /**
     * @property e3
     * @type {Euclidean3}
     * @static
     */
    static e3: Euclidean3;
    /**
     * @method dot
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {number}
     * @static
     */
    static dot(a: VectorE3, b: VectorE3): number;
    /**
     * @class R3
     * @constructor
     * @param data [number[] = [0, 0, 0]]
     * @param modified [boolean = false]
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type {number}
     */
    x: number;
    /**
     * @property y
     * @type Number
     */
    y: number;
    /**
     * @property z
     * @type Number
     */
    z: number;
    /**
     * <p>
     * <code>this ⟼ this + vector * α</code>
     * </p>
     * @method add
     * @param vector {R3}
     * @param α [number = 1]
     * @return {R3} <code>this</code>
     * @chainable
     */
    add(vector: VectorE3, α?: number): R3;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    add2(a: VectorE3, b: VectorE3): R3;
    /**
     * <p>
     * <code>this ⟼ m * this</code>
     * </p>
     * @method applyMatrix3
     * @param m {Matrix3}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    applyMatrix3(m: Matrix3): R3;
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeSimplexGeometry.
     * @method applyMatrix
     * @param m The 4x4 matrix that pre-multiplies this column vector.
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    applyMatrix4(m: Matrix4): R3;
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): R3;
    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE3): R3;
    /**
     * @method clone
     * @return {R3} <code>copy(this)</code>
     */
    clone(): R3;
    /**
     * <p>
     * <code>this ⟼ copy(v)</code>
     * </p>
     * @method copy
     * @param v {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    copy(v: VectorE3): R3;
    /**
     * <p>
     * <code>this ⟼ this ✕ v</code>
     * </p>
     * @method cross
     * @param v {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    cross(v: VectorE3): R3;
    /**
     * <p>
     * <code>this ⟼ a ✕ b</code>
     * </p>
     * @method cross2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    cross2(a: VectorE3, b: VectorE3): R3;
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
     * @return {R3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): R3;
    /**
     * @method dot
     * @param v {VectorE3}
     * @return {number}
     */
    dot(v: VectorE3): number;
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * @method neg
     * @return {R3} <code>this</code>
     * @chainable
     */
    neg(): R3;
    /**
     * Returns the (Euclidean) inner product of this vector with itself.
     * @method squaredNorm
     * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
     */
    squaredNorm(): number;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {VectorE3}
     * @param α {number}
     * @return {R3} <code>this</code>
     * @chainable
     */
    lerp(target: VectorE3, α: number): R3;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {R3} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE3, b: VectorE3, α: number): R3;
    /**
     * <p>
     * <code>this ⟼ this / norm(this)</code>
     * </p>
     * @method normalize
     * @return {R3} <code>this</code>
     * @chainable
     */
    normalize(): R3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     */
    scale(α: number): R3;
    /**
     * <p>
     * <code>this ⟼ this</code>, with components modified.
     * </p>
     * @method set
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setXYZ(x: number, y: number, z: number): R3;
    /**
     * @method setX
     * @param x {number}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setX(x: number): R3;
    /**
     * @method setY
     * @param y {number}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setY(y: number): R3;
    /**
     * @method setZ
     * @param z {number}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setZ(z: number): R3;
    slerp(target: VectorE3, α: number): R3;
    /**
     * <p>
     * <code>this ⟼ this - v</code>
     * </p>
     * @method sub
     * @param v {VectorE3}
     * @param α [number = 1]
     * @return {R3} <code>this</code>
     * @chainable
     */
    sub(v: VectorE3, α?: number): R3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    sub2(a: VectorE3, b: VectorE3): R3;
    toExponential(): string;
    toFixed(digits?: number): string;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {R3}
     * @chainable
     */
    zero(): R3;
    __add__(rhs: R3): R3;
    __sub__(rhs: R3): R3;
    __mul__(rhs: number): R3;
    /**
     * @method copy
     * @param vector {VectorE3}
     * @return {R3}
     * @static
     */
    static copy(vector: VectorE3): R3;
    /**
     * @method lerp
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {R3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: VectorE3, b: VectorE3, α: number): R3;
    /**
     * @method random
     * @return {R3}
     * @static
     */
    static random(): R3;
}
export = R3;
