import Cartesian3 = require('../math/Cartesian3');
import LinearElement = require('../math/LinearElement');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Spinor3Coords = require('../math/Spinor3Coords');
import VectorN = require('../math/VectorN');
/**
 * @class Vector3
 * @extends VectorN<number>
 */
declare class Vector3 extends VectorN<number> implements Cartesian3, LinearElement<Cartesian3, Vector3, Spinor3Coords, Cartesian3> {
    static e1: Vector3;
    static e2: Vector3;
    static e3: Vector3;
    /**
     * @method dot
     * @param a {Cartesian3}
     * @param b {Cartesian3}
     * @return {number}
     * @static
     */
    static dot(a: Cartesian3, b: Cartesian3): number;
    /**
     * @class Vector3
     * @constructor
     * @param data [number[] = [0, 0, 0]]
     * @param modified [boolean = false]
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
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
     * @param vector {Vector3}
     * @param α [number = 1]
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    add(vector: Cartesian3, α?: number): Vector3;
    /**
     * <p>
     * <code>this ⟼ m * this</code>
     * </p>
     * @method applyMatrix3
     * @param m {Matrix3}
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated
     */
    applyMatrix3(m: Matrix3): Vector3;
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeSimplexGeometry.
     * @method applyMatrix
     * @param m The 4x4 matrix that pre-multiplies this column vector.
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated
     */
    applyMatrix4(m: Matrix4): Vector3;
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {Cartesian3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    reflect(n: Cartesian3): Vector3;
    /**
     * <p>
     * <code>this ⟼ R * this * reverse(R)</code>
     * </p>
     * @method rotate
     * @param R {Spinor3Coords}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    rotate(R: Spinor3Coords): Vector3;
    /**
     * @method clone
     * @return {Vector3} <code>copy(this)</code>
     */
    clone(): Vector3;
    /**
     * <p>
     * <code>this ⟼ copy(v)</code>
     * </p>
     * @method copy
     * @param v {Cartesian3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    copy(v: Cartesian3): Vector3;
    /**
     * <p>
     * <code>this ⟼ this ✕ v</code>
     * </p>
     * @method cross
     * @param v {Cartesian3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    cross(v: Cartesian3): Vector3;
    /**
     * <p>
     * <code>this ⟼ a ✕ b</code>
     * </p>
     * @method cross2
     * @param a {Cartesian3}
     * @param b {Cartesian3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    cross2(a: Cartesian3, b: Cartesian3): Vector3;
    /**
     * @method distanceTo
     * @param point {Cartesian3}
     * @return {number}
     */
    distanceTo(point: Cartesian3): number;
    /**
     * @method quadranceTo
     * @param point {Cartesian3}
     * @return {number}
     */
    quadranceTo(point: Cartesian3): number;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divideByScalar
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): Vector3;
    /**
     * @method dot
     * @param v {Cartesian3}
     * @return {number}
     */
    dot(v: Cartesian3): number;
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
     * @param target {Cartesian3}
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    lerp(target: Cartesian3, α: number): Vector3;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {Cartesian3}
     * @param b {Cartesian3}
     * @param α {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    lerp2(a: Cartesian3, b: Cartesian3, α: number): Vector3;
    /**
     * <p>
     * <code>this ⟼ this / norm(this)</code>
     * </p>
     * @method normalize
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    normalize(): Vector3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     */
    scale(α: number): Vector3;
    /**
     * <p>
     * <code>this ⟼ this</code>, with components modified.
     * </p>
     * @method set
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setXYZ(x: number, y: number, z: number): Vector3;
    /**
     * <p>
     * <code>this ⟼ magnitude * this / norm(this)</code>
     * </p>
     * @method setMagnitude
     * @param magnitude {number}
     * @return {Vector3} <code>this</code>
     */
    setMagnitude(magnitude: number): Vector3;
    /**
     * @method setX
     * @param x {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setX(x: number): Vector3;
    /**
     * @method setY
     * @param y {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setY(y: number): Vector3;
    /**
     * @method setZ
     * @param z {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setZ(z: number): Vector3;
    /**
     * <p>
     * <code>this ⟼ this - v</code>
     * </p>
     * @method sub
     * @param v {Cartesian3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    sub(v: Cartesian3): Vector3;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method sum
     * @param a {Cartesian3}
     * @param b {Cartesian3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    sum(a: Cartesian3, b: Cartesian3): Vector3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method diff
     * @param a {Cartesian3}
     * @param b {Cartesian3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    diff(a: Cartesian3, b: Cartesian3): Vector3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    __add__(rhs: Vector3): Vector3;
    __sub__(rhs: Vector3): Vector3;
    __mul__(rhs: number): Vector3;
    /**
     * @method copy
     * @param vector {Cartesian}
     * @return {Vector3}
     * @static
     */
    static copy(vector: Cartesian3): Vector3;
    /**
     * @method lerp
     * @param a {Cartesian3}
     * @param b {Cartesian3}
     * @param α {number}
     * @return {Vector3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: Cartesian3, b: Cartesian3, α: number): Vector3;
    /**
     * @method random
     * @return {Vector3}
     * @static
     */
    static random(): Vector3;
}
export = Vector3;
