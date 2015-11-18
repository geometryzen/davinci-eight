import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import Ring = require('../math/MutableRingElement');
import SpinorE3 = require('../math/SpinorE3');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');
/**
 * @class Matrix4
 * @extends AbstractMatrix
 */
declare class Matrix4 extends AbstractMatrix<Matrix4> implements Matrix<Matrix4, VectorE4>, Ring<Matrix4> {
    /**
     * 4x4 (square) matrix of numbers.
     * Constructs a Matrix4 by wrapping a Float32Array.
     * @class Matrix4
     * @constructor
     */
    constructor(elements: Float32Array);
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Matrix4}
     * @chainable
     * @static
     */
    static one(): Matrix4;
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Matrix4}
     * @chainable
     * @static
     */
    static zero(): Matrix4;
    /**
     * @method scaling
     * @param scale {VectorE3}
     * @return {Matrix4}
     * @chainable
     * @static
     */
    static scaling(scale: VectorE3): Matrix4;
    /**
     * @method translation
     * @param vector {VectorE3}
     * @return {Matrix4}
     * @chainable
     * @static
     */
    static translation(vector: VectorE3): Matrix4;
    /**
     * @method rotation
     * @param spinor {SpinorE3}
     * @return {Matrix4}
     * @chainable
     * @static
     */
    static rotation(spinor: SpinorE3): Matrix4;
    /**
     * Returns a copy of this Matrix4 instance.
     * @method clone
     * @return {Matrix4}
     * @chainable
     */
    clone(): Matrix4;
    /**
     * @method compose
     * @param scale {VectorE3}
     * @param attitude {SpinorE3}
     * @param position {VectorE3}
     * @return {Matrix4}
     * @chainable
     */
    compose(scale: VectorE3, attitude: SpinorE3, position: VectorE3): Matrix4;
    /**
     * @method copy
     * @param m {Matrix4}
     * @return {Matrix4}
     * @chaninable
     */
    copy(m: Matrix4): Matrix4;
    /**
     * Computes the determinant.
     * @method det
     * @return {number}
     */
    det(): number;
    /**
     * @method inv
     * @return {Matrix4}
     */
    inv(): Matrix4;
    /**
     * @method invert
     * @param m {Matrix4}
     * @return {Matrix4}
     * @deprecated
     * @private
     */
    invert(m: Matrix4): Matrix4;
    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Matrix4}
     * @chainable
     */
    one(): Matrix4;
    /**
     * @method scale
     * @param s {number}
     * @return {Matrix4}
     * @chainable
     */
    scale(s: number): Matrix4;
    /**
     * @method transpose
     * @return {Matrix4}
     * @chainable
     */
    transpose(): Matrix4;
    /**
     * @method frustum
     * @param left {number}
     * @param right {number}
     * @param bottom {number}
     * @param top {number}
     * @param near {number}
     * @param far {number}
     * @return {Matrix4}
     * @chainable
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    /**
     * @method rotationAxis
     * @param axis {VectorE3}
     * @param angle {number}
     * @return {Matrix4}
     * @chainable
     * @beta
     */
    rotationAxis(axis: VectorE3, angle: number): Matrix4;
    /**
     * @method mul
     * @param rhs {Matrix4}
     * @return {Matrix4}
     * @chainable
     */
    mul(rhs: Matrix4): Matrix4;
    /**
     * @method mul2
     * @param a {Matrix4}
     * @param b {Matrix4}
     * @return {Matrix4}
     * @chainable
     */
    mul2(a: Matrix4, b: Matrix4): Matrix4;
    /**
     * @method rmul
     * @param lhs {Matrix4}
     * @return {Matrix4}
     * @chainable
     */
    rmul(lhs: Matrix4): Matrix4;
    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     * @method reflection
     * @param n {VectorE3}
     * @return {Matrix4}
     * @chainable
     */
    reflection(n: VectorE3): Matrix4;
    /**
     * <p>
     * <code>this ⟼ rotation(spinor) * this</code>
     * </p>
     * @method rotate
     * @param spinor {SpinorE3}
     * @return {Matrix4}
     * @chainable
     */
    rotate(spinor: SpinorE3): Matrix4;
    /**
     * <p>
     * <code>this ⟼ rotation(spinor)</code>
     * </p>
     * @method rotation
     * @param attitude  The spinor from which the rotation will be computed.
     * @return {Matrix4}
     * @chainable
     */
    rotation(spinor: SpinorE3): Matrix4;
    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {Array<number>}
     */
    row(i: number): Array<number>;
    /**
     * @method scaleXYZ
     * @param scale {VectorE3}
     * @return {Matrix4}
     * @chainable
     */
    scaleXYZ(scale: VectorE3): Matrix4;
    /**
     * @method scaling
     * @param scale {VectorE3}
     * @return {Matrix4}
     * @chainable
     */
    scaling(scale: VectorE3): Matrix4;
    /**
     * @method set
     * @return {Matrix4}
     * @chainable
     * @private
     */
    private set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
    /**
     * @method toFixed
     * @param [digits] {number}
     * @return {string}
     */
    toFixed(digits?: number): string;
    /**
     * @method toString
     * @return {string}
     */
    toString(): string;
    /**
     * <p>
     * <code>this ⟼ translation(spinor) * this</code>
     * </p>
     * @method translate
     * @param displacement {VectorE3}
     * @return {Matrix4}
     * @chaninable
     */
    translate(displacement: VectorE3): Matrix4;
    /**
     * @method translation
     * @param displacement {VectorE3}
     * @return {Matrix4}
     * @chaninable
     */
    translation(displacement: VectorE3): Matrix4;
    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Matrix4}
     * @chainable
     */
    zero(): Matrix4;
    /**
     * @method __mul__
     * @param rhs {Matrix4|number}
     * @return {Matrix4}
     * @chainable
     * @private
     */
    private __mul__(rhs);
    /**
     * @method __rmul__
     * @param lhs {Matrix4|number}
     * @return {Matrix4}
     * @chainable
     * @private
     */
    private __rmul__(lhs);
}
export = Matrix4;
