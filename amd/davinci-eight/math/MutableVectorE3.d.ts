import VectorE3 = require('../math/VectorE3');
import Euclidean3 = require('../math/Euclidean3');
import LinearElement = require('../math/LinearElement');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import SpinorE3 = require('../math/SpinorE3');
import VectorN = require('../math/VectorN');
/**
 * @class MutableVectorE3
 * @extends VectorN<number>
 */
declare class MutableVectorE3 extends VectorN<number> implements VectorE3, LinearElement<VectorE3, MutableVectorE3, SpinorE3, VectorE3> {
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
     * @class MutableVectorE3
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
     * @param vector {MutableVectorE3}
     * @param α [number = 1]
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    add(vector: VectorE3, α?: number): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    add2(a: VectorE3, b: VectorE3): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ m * this</code>
     * </p>
     * @method applyMatrix3
     * @param m {Matrix3}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     * @deprecated
     */
    applyMatrix3(m: Matrix3): MutableVectorE3;
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeSimplexGeometry.
     * @method applyMatrix
     * @param m The 4x4 matrix that pre-multiplies this column vector.
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     * @deprecated
     */
    applyMatrix4(m: Matrix4): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE3}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ R * this * reverse(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE3}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE3): MutableVectorE3;
    /**
     * @method clone
     * @return {MutableVectorE3} <code>copy(this)</code>
     */
    clone(): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ copy(v)</code>
     * </p>
     * @method copy
     * @param v {VectorE3}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    copy(v: VectorE3): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ this ✕ v</code>
     * </p>
     * @method cross
     * @param v {VectorE3}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    cross(v: VectorE3): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ a ✕ b</code>
     * </p>
     * @method cross2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    cross2(a: VectorE3, b: VectorE3): MutableVectorE3;
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
     * @method divideByScalar
     * @param α {number}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): MutableVectorE3;
    /**
     * @method dot
     * @param v {VectorE3}
     * @return {number}
     */
    dot(v: VectorE3): number;
    /**
     * Returns the (Euclidean) norm of this vector.
     * @method magnitude
     * @return {number} <code>norm(this)</code>
     */
    magnitude(): number;
    /**
     * Returns the (Euclidean) inner product of this vector with itself.
     * @method quaditude
     * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
     */
    quaditude(): number;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {VectorE3}
     * @param α {number}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    lerp(target: VectorE3, α: number): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE3, b: VectorE3, α: number): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ this / norm(this)</code>
     * </p>
     * @method normalize
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    normalize(): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     */
    scale(α: number): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ this</code>, with components modified.
     * </p>
     * @method set
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setXYZ(x: number, y: number, z: number): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ magnitude * this / norm(this)</code>
     * </p>
     * @method setMagnitude
     * @param magnitude {number}
     * @return {MutableVectorE3} <code>this</code>
     */
    setMagnitude(magnitude: number): MutableVectorE3;
    /**
     * @method setX
     * @param x {number}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setX(x: number): MutableVectorE3;
    /**
     * @method setY
     * @param y {number}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setY(y: number): MutableVectorE3;
    /**
     * @method setZ
     * @param z {number}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setZ(z: number): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ this - v</code>
     * </p>
     * @method sub
     * @param v {VectorE3}
     * @param α [number = 1]
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    sub(v: VectorE3, α?: number): MutableVectorE3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {MutableVectorE3} <code>this</code>
     * @chainable
     */
    sub2(a: VectorE3, b: VectorE3): MutableVectorE3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    __add__(rhs: MutableVectorE3): MutableVectorE3;
    __sub__(rhs: MutableVectorE3): MutableVectorE3;
    __mul__(rhs: number): MutableVectorE3;
    /**
     * @method copy
     * @param vector {VectorE3}
     * @return {MutableVectorE3}
     * @static
     */
    static copy(vector: VectorE3): MutableVectorE3;
    /**
     * @method lerp
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {MutableVectorE3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: VectorE3, b: VectorE3, α: number): MutableVectorE3;
    /**
     * @method random
     * @return {MutableVectorE3}
     * @static
     */
    static random(): MutableVectorE3;
}
export = MutableVectorE3;
