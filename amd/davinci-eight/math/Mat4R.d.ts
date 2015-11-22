import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import Ring = require('../math/MutableRingElement');
import SpinorE3 = require('../math/SpinorE3');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');
/**
 * @class Mat4R
 * @extends AbstractMatrix
 */
declare class Mat4R extends AbstractMatrix<Mat4R> implements Matrix<Mat4R, VectorE4>, Ring<Mat4R> {
    /**
     * 4x4 (square) matrix of numbers.
     * Constructs a Mat4R by wrapping a Float32Array.
     * @class Mat4R
     * @constructor
     */
    constructor(elements: Float32Array);
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Mat4R}
     * @chainable
     * @static
     */
    static one(): Mat4R;
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Mat4R}
     * @chainable
     * @static
     */
    static zero(): Mat4R;
    /**
     * @method scaling
     * @param scale {VectorE3}
     * @return {Mat4R}
     * @chainable
     * @static
     */
    static scaling(scale: VectorE3): Mat4R;
    /**
     * @method translation
     * @param vector {VectorE3}
     * @return {Mat4R}
     * @chainable
     * @static
     */
    static translation(vector: VectorE3): Mat4R;
    /**
     * @method rotation
     * @param spinor {SpinorE3}
     * @return {Mat4R}
     * @chainable
     * @static
     */
    static rotation(spinor: SpinorE3): Mat4R;
    /**
     * Returns a copy of this Mat4R instance.
     * @method clone
     * @return {Mat4R}
     * @chainable
     */
    clone(): Mat4R;
    /**
     * @method compose
     * @param scale {VectorE3}
     * @param attitude {SpinorE3}
     * @param position {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    compose(scale: VectorE3, attitude: SpinorE3, position: VectorE3): Mat4R;
    /**
     * @method copy
     * @param m {Mat4R}
     * @return {Mat4R}
     * @chaninable
     */
    copy(m: Mat4R): Mat4R;
    /**
     * Computes the determinant.
     * @method det
     * @return {number}
     */
    det(): number;
    /**
     * @method inv
     * @return {Mat4R}
     */
    inv(): Mat4R;
    /**
     * @method invert
     * @param m {Mat4R}
     * @return {Mat4R}
     * @deprecated
     * @private
     */
    invert(m: Mat4R): Mat4R;
    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Mat4R}
     * @chainable
     */
    one(): Mat4R;
    /**
     * @method scale
     * @param s {number}
     * @return {Mat4R}
     * @chainable
     */
    scale(s: number): Mat4R;
    /**
     * @method transpose
     * @return {Mat4R}
     * @chainable
     */
    transpose(): Mat4R;
    /**
     * @method frustum
     * @param left {number}
     * @param right {number}
     * @param bottom {number}
     * @param top {number}
     * @param near {number}
     * @param far {number}
     * @return {Mat4R}
     * @chainable
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4R;
    /**
     * @method rotationAxis
     * @param axis {VectorE3}
     * @param angle {number}
     * @return {Mat4R}
     * @chainable
     * @beta
     */
    rotationAxis(axis: VectorE3, angle: number): Mat4R;
    /**
     * @method mul
     * @param rhs {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    mul(rhs: Mat4R): Mat4R;
    /**
     * @method mul2
     * @param a {Mat4R}
     * @param b {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    mul2(a: Mat4R, b: Mat4R): Mat4R;
    /**
     * @method rmul
     * @param lhs {Mat4R}
     * @return {Mat4R}
     * @chainable
     */
    rmul(lhs: Mat4R): Mat4R;
    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     * @method reflection
     * @param n {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    reflection(n: VectorE3): Mat4R;
    /**
     * <p>
     * <code>this ⟼ rotation(spinor) * this</code>
     * </p>
     * @method rotate
     * @param spinor {SpinorE3}
     * @return {Mat4R}
     * @chainable
     */
    rotate(spinor: SpinorE3): Mat4R;
    /**
     * <p>
     * <code>this ⟼ rotation(spinor)</code>
     * </p>
     * @method rotation
     * @param attitude  The spinor from which the rotation will be computed.
     * @return {Mat4R}
     * @chainable
     */
    rotation(spinor: SpinorE3): Mat4R;
    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {Array<number>}
     */
    row(i: number): Array<number>;
    /**
     * @method scaleXYZ
     * @param scale {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    scaleXYZ(scale: VectorE3): Mat4R;
    /**
     * @method scaling
     * @param scale {VectorE3}
     * @return {Mat4R}
     * @chainable
     */
    scaling(scale: VectorE3): Mat4R;
    /**
     * @method set
     * @return {Mat4R}
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
     * @return {Mat4R}
     * @chaninable
     */
    translate(displacement: VectorE3): Mat4R;
    /**
     * @method translation
     * @param displacement {VectorE3}
     * @return {Mat4R}
     * @chaninable
     */
    translation(displacement: VectorE3): Mat4R;
    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Mat4R}
     * @chainable
     */
    zero(): Mat4R;
    /**
     * @method __mul__
     * @param rhs {Mat4R|number}
     * @return {Mat4R}
     * @chainable
     * @private
     */
    private __mul__(rhs);
    /**
     * @method __rmul__
     * @param lhs {Mat4R|number}
     * @return {Mat4R}
     * @chainable
     * @private
     */
    private __rmul__(lhs);
}
export = Mat4R;
