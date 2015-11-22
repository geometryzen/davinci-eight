import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import Ring = require('../math/MutableRingElement');
import RingOperators = require('../math/RingOperators');
import VectorE2 = require('../math/VectorE2');
/**
 * @class Mat2R
 * @extends AbstractMatrix
 */
declare class Mat2R extends AbstractMatrix<Mat2R> implements Matrix<Mat2R, VectorE2>, Ring<Mat2R>, RingOperators<Mat2R> {
    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Mat2R by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 2
     * 1 3
     *
     * @class Mat2R
     * @constructor
     * @param elements {Float32Array} The elements of the matrix in column-major order.
     */
    constructor(elements: Float32Array);
    /**
     * @method add
     * @param rhs {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    add(rhs: Mat2R): Mat2R;
    clone(): Mat2R;
    /**
     * Computes the determinant.
     * @method det
     * @return {number}
     */
    det(): number;
    /**
     * @method inv
     * @return {Mat2R}
     * @chainable
     */
    inv(): Mat2R;
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
     * @param rhs {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    mul(rhs: Mat2R): Mat2R;
    /**
     * @method mul2
     * @param a {Mat2R}
     * @param b {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    mul2(a: Mat2R, b: Mat2R): Mat2R;
    /**
     * @method neg
     * @return {Mat2R}
     * @chainable
     */
    neg(): Mat2R;
    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Mat2R}
     * @chainable
     */
    one(): Mat2R;
    /**
     * Sets this matrix to the transformation for a
     * reflection in the line normal to the unit vector <code>n</code>.
     * <p>
     * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
     * </p>
     * @method reflection
     * @param n {VectorE2}
     * @return {Mat2R}
     * @chainable
     */
    reflection(n: VectorE2): Mat2R;
    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {Array<number>}
     */
    row(i: number): Array<number>;
    /**
     * @method scale
     * @param α {number}
     * @return {Mat2R}
     * @chainable
     */
    scale(α: number): Mat2R;
    /**
     * Sets all elements of this matrix to the supplied row-major values m11, ..., m22.
     * @method set
     * @param m11 {number}
     * @param m12 {number}
     * @param m21 {number}
     * @param m22 {number}
     * @return {Mat2R}
     * @chainable
     */
    set(m11: number, m12: number, m21: number, m22: number): Mat2R;
    /**
     * @method sub
     * @param rhs {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    sub(rhs: Mat2R): Mat2R;
    /**
     * @method toExponential
     * @return {string}
     */
    toExponential(): string;
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
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Mat2R}
     * @chainable
     */
    zero(): Mat2R;
    __add__(rhs: any): Mat2R;
    __radd__(lhs: any): Mat2R;
    __mul__(rhs: any): Mat2R;
    __rmul__(lhs: any): Mat2R;
    __pos__(): Mat2R;
    __neg__(): Mat2R;
    __sub__(rhs: any): Mat2R;
    __rsub__(lhs: any): Mat2R;
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Mat2R}
     * @static
     * @chainable
     */
    static one(): Mat2R;
    /**
     * @method reflection
     * @param n {VectorE2}
     * @return {Mat2R}
     * @static
     * @chainable
     */
    static reflection(n: VectorE2): Mat2R;
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Mat2R}
     * @static
     * @chainable
     */
    static zero(): Mat2R;
}
export = Mat2R;
