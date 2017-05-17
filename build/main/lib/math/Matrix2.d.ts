import { AbstractMatrix } from '../math/AbstractMatrix';
import { VectorE1 } from '../math/VectorE1';
/**
 *
 */
export declare class Matrix2 extends AbstractMatrix<Matrix2> {
    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Matrix2 by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 2
     * 1 3
     *
     * @param elements The elements of the matrix in column-major order.
     */
    constructor(elements: Float32Array);
    add(rhs: Matrix2): Matrix2;
    add2(a: Matrix2, b: Matrix2): Matrix2;
    clone(): Matrix2;
    /**
     * Computes the determinant.
     */
    det(): number;
    /**
     * Sets this matrix to its inverse.
     */
    inv(): Matrix2;
    /**
     * Determines whether this matrix is the identity matrix for multiplication.
     */
    isOne(): boolean;
    /**
     * Determines whether this matrix is the identity matrix for addition.
     */
    isZero(): boolean;
    mul(rhs: Matrix2): Matrix2;
    mul2(a: Matrix2, b: Matrix2): Matrix2;
    /**
     * Sets this matrix to its additive inverse.
     */
    neg(): Matrix2;
    /**
     * Sets this matrix to the identity element for multiplication, 1.
     */
    one(): Matrix2;
    /**
     * Sets this matrix to the transformation for a
     * reflection in the line normal to the unit vector <code>n</code>.
     *
     * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
     *
     */
    reflection(n: VectorE1): Matrix2;
    /**
     * Returns the row for the specified index.
     * @param i the zero-based index of the row.
     */
    row(i: number): Array<number>;
    /**
     * Multiplies this matrix by the scale factor, α.
     */
    scale(α: number): Matrix2;
    /**
     * Sets all elements of this matrix to the supplied row-major values m11, ..., m22.
     * @method set
     * @param m11 {number}
     * @param m12 {number}
     * @param m21 {number}
     * @param m22 {number}
     * @return {Matrix2}
     * @chainable
     */
    set(m11: number, m12: number, m21: number, m22: number): Matrix2;
    /**
     * @method sub
     * @param rhs {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    sub(rhs: Matrix2): Matrix2;
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
    /**
     * @method translation
     * @param d {VectorE1}
     * @return {Matrix2}
     * @chainable
     */
    translation(d: VectorE1): Matrix2;
    /**
     * Sets this matrix to the identity element for addition, 0.
     */
    zero(): Matrix2;
    __add__(rhs: any): Matrix2;
    __radd__(lhs: any): Matrix2;
    __mul__(rhs: any): Matrix2;
    __rmul__(lhs: any): Matrix2;
    __pos__(): Matrix2;
    __neg__(): Matrix2;
    __sub__(rhs: any): Matrix2;
    __rsub__(lhs: any): Matrix2;
    static readonly one: Matrix2;
    /**
     *
     */
    static reflection(n: VectorE1): Matrix2;
    static readonly zero: Matrix2;
}
