import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import Mat4R = require('./Mat4R');
import Ring = require('../math/MutableRingElement');
import RingOperators = require('../math/RingOperators');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
/**
 * @class Mat3R
 * @extends AbstractMatrix
 */
declare class Mat3R extends AbstractMatrix<Mat3R> implements Matrix<Mat3R, VectorE3, VectorE2>, Ring<Mat3R>, RingOperators<Mat3R> {
    /**
     * 3x3 (square) matrix of numbers.
     * Constructs a Mat3R by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 3 6
     * 1 4 7
     * 2 5 8
     *
     * @class Mat3R
     * @constructor
     */
    constructor(elements: Float32Array);
    /**
     * @method add
     * @param rhs {Mat3R}
     * @return {Mat3R}
     * @chainable
     */
    add(rhs: Mat3R): Mat3R;
    /**
     * @method add2
     * @param a {Mat3R}
     * @param b {Mat3R}
     * @return {Mat3R}
     * @chainable
     */
    add2(a: Mat3R, b: Mat3R): Mat3R;
    /**
     * Returns a copy of this Mat3R instance.
     * @method clone
     * @return {Mat3R}
     * @chainable
     */
    clone(): Mat3R;
    /**
     * Computes the determinant.
     * @method det
     * @return {number}
     */
    det(): number;
    /**
     * @method getInverse
     * @param matrix {Mat4R}
     * @return {Mat3R}
     * @deprecated
     * @private
     */
    getInverse(matrix: Mat4R, throwOnInvertible?: boolean): Mat3R;
    /**
     * @method inv
     * @return {Mat3R}
     * @chainable
     */
    inv(): Mat3R;
    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean;
    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean;
    /**
     * @method mul
     * @param rhs {Mat3R}
     * @return {Mat3R}
     * @chainable
     */
    mul(rhs: Mat3R): Mat3R;
    /**
     * @method mul2
     * @param a {Mat3R}
     * @param b {Mat3R}
     * @return {Mat3R}
     * @chainable
     */
    mul2(a: Mat3R, b: Mat3R): Mat3R;
    /**
     * @method neg
     * @return {Mat3R}
     * @chainable
     */
    neg(): Mat3R;
    /**
     * @method normalFromMat4R
     * @param m {Mat4R}
     * @return {Mat3R}
     * @deprecated
     * @private
     */
    normalFromMat4R(m: Mat4R): Mat3R;
    /**
     * @method one
     * @return {Mat3R}
     * @chainable
     */
    one(): Mat3R;
    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     * @method reflection
     * @param n {VectorE2}
     * @return {Mat3R}
     * @chainable
     */
    reflection(n: VectorE2): Mat3R;
    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {number[]}
     */
    row(i: number): number[];
    /**
     * @method scale
     * @param s {number}
     * @return {Mat3R}
     */
    scale(s: number): Mat3R;
    /**
     * Sets all elements of this matrix to the supplied row-major values.
     * @method set
     * @param m11 {number}
     * @param m12 {number}
     * @param m13 {number}
     * @param m21 {number}
     * @param m22 {number}
     * @param m23 {number}
     * @param m31 {number}
     * @param m32 {number}
     * @param m33 {number}
     * @return {Mat3R}
     * @chainable
     */
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): Mat3R;
    /**
     * @method sub
     * @param rhs {Mat3R}
     * @return {Mat3R}
     */
    sub(rhs: Mat3R): Mat3R;
    /**
     * @method toString
     * @return {string}
     */
    toString(): string;
    /**
     * @method translation
     * @param d {VectorE2}
     * @return {Mat3R}
     * @chainable
     */
    translation(d: VectorE2): Mat3R;
    /**
     * @method transpose
     * @return {Mat3R}
     */
    transpose(): Mat3R;
    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Mat3R}
     * @chainable
     */
    zero(): Mat3R;
    __add__(rhs: any): Mat3R;
    __radd__(lhs: any): Mat3R;
    __mul__(rhs: any): Mat3R;
    __rmul__(lhs: any): Mat3R;
    __pos__(): Mat3R;
    __neg__(): Mat3R;
    __sub__(rhs: any): Mat3R;
    __rsub__(lhs: any): Mat3R;
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Mat3R}
     * @static
     */
    static one(): Mat3R;
    /**
     * @method reflection
     * @param n {VectorE2}
     * @return {Mat3R}
     * @static
     * @chainable
     */
    static reflection(n: VectorE2): Mat3R;
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Mat3R}
     * @static
     */
    static zero(): Mat3R;
}
export = Mat3R;
