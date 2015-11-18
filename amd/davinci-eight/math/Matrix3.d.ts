import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import Matrix4 = require('./Matrix4');
import Ring = require('../math/MutableRingElement');
import RingOperators = require('../math/RingOperators');
import VectorE3 = require('../math/VectorE3');
/**
 * @class Matrix3
 * @extends AbstractMatrix
 */
declare class Matrix3 extends AbstractMatrix<Matrix3> implements Matrix<Matrix3, VectorE3>, Ring<Matrix3>, RingOperators<Matrix3> {
    /**
     * 3x3 (square) matrix of numbers.
     * Constructs a Matrix3 by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 3 6
     * 1 4 7
     * 2 5 8
     *
     * @class Matrix3
     * @constructor
     */
    constructor(elements: Float32Array);
    /**
     * @method add
     * @param rhs {Matrix3}
     * @return {Matrix3}
     */
    add(rhs: Matrix3): Matrix3;
    /**
     * Returns a copy of this Matrix3 instance.
     * @method clone
     * @return {Matrix3}
     * @chainable
     */
    clone(): Matrix3;
    /**
     * Computes the determinant.
     * @method det
     * @return {number}
     */
    det(): number;
    /**
     * @method getInverse
     * @param matrix {Matrix4}
     * @return {Matrix3}
     * @deprecated
     * @private
     */
    getInverse(matrix: Matrix4, throwOnInvertible?: boolean): Matrix3;
    /**
     * @method inv
     * @return {Matrix3}
     * @chainable
     */
    inv(): Matrix3;
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
     * @param rhs {Matrix3}
     * @return {Matrix3}
     * @chainable
     */
    mul(rhs: Matrix3): Matrix3;
    /**
     * @method mul2
     * @param a {Matrix3}
     * @param b {Matrix3}
     * @return {Matrix3}
     * @chainable
     */
    mul2(a: Matrix3, b: Matrix3): Matrix3;
    /**
     * @method neg
     * @return {Matrix3}
     * @chainable
     */
    neg(): Matrix3;
    /**
     * @method normalFromMatrix4
     * @param m {Matrix4}
     * @return {Matrix3}
     * @deprecated
     * @private
     */
    normalFromMatrix4(m: Matrix4): Matrix3;
    /**
     * @method one
     * @return {Matrix3}
     * @chainable
     */
    one(): Matrix3;
    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     * @method reflection
     * @param n {VectorE3}
     * @return {Matrix3}
     * @chainable
     */
    reflection(n: VectorE3): Matrix3;
    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {number[]}
     */
    row(i: number): number[];
    /**
     * @method scale
     * @param s {number}
     * @return {Matrix3}
     */
    scale(s: number): Matrix3;
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
     * @return {Matrix3}
     * @chainable
     */
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): Matrix3;
    /**
     * @method sub
     * @param rhs {Matrix3}
     * @return {Matrix3}
     */
    sub(rhs: Matrix3): Matrix3;
    /**
     * @method toString
     * @return {string}
     */
    toString(): string;
    /**
     * @method transpose
     * @return {Matrix3}
     */
    transpose(): Matrix3;
    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Matrix3}
     * @chainable
     */
    zero(): Matrix3;
    __add__(rhs: any): Matrix3;
    __radd__(lhs: any): Matrix3;
    __mul__(rhs: any): Matrix3;
    __rmul__(lhs: any): Matrix3;
    __pos__(): Matrix3;
    __neg__(): Matrix3;
    __sub__(rhs: any): Matrix3;
    __rsub__(lhs: any): Matrix3;
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Matrix3}
     * @static
     */
    static one(): Matrix3;
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Matrix3}
     * @static
     */
    static zero(): Matrix3;
}
export = Matrix3;
