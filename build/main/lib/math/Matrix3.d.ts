import { AbstractMatrix } from '../math/AbstractMatrix';
import { Matrix4 } from './Matrix4';
import { SpinorE2 } from '../math/SpinorE2';
import { VectorE2 } from '../math/VectorE2';
/**
 * <p>
 * A 3x3 (square) matrix of <code>number</code>s.
 * </p>
 * <p>
 * An adapter over a <code>Float32Array</code>, enabling it to be used directly with WebGL.
 * </p>
 * <p>
 * The 9 elements are stored in <em>column-major</em> order (the order expected by WebGL):
 * <table>
 * <tr><td>0</td><td>3</td><td>6</td></tr>
 * <tr><td>1</td><td>4</td><td>7</td></tr>
 * <tr><td>2</td><td>5</td><td>8</td></tr>
 * </table>
 * </p>
 */
export declare class Matrix3 extends AbstractMatrix<Matrix3> {
    /**
     * @param elements
     */
    constructor(elements: Float32Array);
    /**
     *
     */
    add(rhs: Matrix3): this;
    /**
     *
     */
    add2(a: Matrix3, b: Matrix3): this;
    /**
     * Returns a copy of this Matrix3 instance.
     */
    clone(): Matrix3;
    /**
     * Computes the determinant.
     */
    det(): number;
    /**
     * <p>
     * Sets this matrix to the inverse of the upper-left 3x3 portion of a 4x4 matrix.
     * </p>
     *
     * @param matrix
     * @param throwOnSingular
     */
    private invertUpperLeft(matrix, throwOnSingular?);
    /**
     *
     */
    inv(): this;
    /**
     *
     */
    isOne(): boolean;
    /**
     *
     */
    isZero(): boolean;
    /**
     * @param rhs
     */
    mul(rhs: Matrix3): this;
    /**
     * @param lhs
     */
    rmul(lhs: Matrix3): this;
    /**
     * @param a
     * @param b
     */
    mul2(a: Matrix3, b: Matrix3): this;
    /**
     *
     */
    neg(): this;
    /**
     * <p>
     * Sets this 3x3 matrix to the matrix required to properly transform normal vectors
     * (pseudo or axial vectors) based upon the 4x4 matrix used to transform polar vectors.
     * </p>
     *
     * @param m
     */
    normalFromMatrix4(m: Matrix4): this;
    /**
     *
     */
    one(): this;
    /**
     * <p>
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * </p>
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     *
     * @param n
     */
    reflection(n: VectorE2): this;
    /**
     * @param i the zero-based index of the row.
     */
    row(i: number): number[];
    /**
     * @param spinor
     */
    rotate(spinor: SpinorE2): this;
    /**
     * @param spinor
     */
    rotation(spinor: SpinorE2): this;
    /**
     * @param s
     */
    scale(s: number): this;
    /**
     * <p>
     * Sets all elements of this matrix to the supplied values (provided in <em>row-major</em> order).
     * </p>
     * <p>
     * An advantage of this method is that the function call resembles the matrix written out.
     * </p>
     * <p>
     * The parameters are named according to the 1-based row and column.
     * </p>
     *
     * @param n11
     * @param n12
     * @param n13
     * @param n21
     * @param n22
     * @param n23
     * @param n31
     * @param n32
     * @param n33
     */
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
    /**
     * @param rhs
     */
    sub(rhs: Matrix3): this;
    /**
     * @param fractionDigits
     */
    toExponential(fractionDigits?: number): string;
    /**
     * @param fractionDigits
     */
    toFixed(fractionDigits?: number): string;
    /**
     * @param precision
     */
    toPrecision(precision?: number): string;
    /**
     * @param radix
     */
    toString(radix?: number): string;
    /**
     * <p>
     * Computes the homogeneous translation matrix for a 2D translation.
     * </p>
     *
     * @param d
     */
    translation(d: VectorE2): this;
    /**
     *
     */
    transpose(): this;
    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     */
    zero(): this;
    __add__(rhs: any): Matrix3;
    __radd__(lhs: any): Matrix3;
    __mul__(rhs: any): Matrix3;
    __rmul__(lhs: any): Matrix3;
    __pos__(): Matrix3;
    __neg__(): Matrix3;
    __sub__(rhs: any): Matrix3;
    __rsub__(lhs: any): Matrix3;
    /**
     * The identity matrix for multiplication.
     * The matrix is locked (immutable), but may be cloned.
     */
    static readonly one: Matrix3;
    /**
     * @param n
     */
    static reflection(n: VectorE2): Matrix3;
    /**
     * @param spinor
     */
    static rotation(spinor: SpinorE2): Matrix3;
    /**
     * @param d
     */
    static translation(d: VectorE2): Matrix3;
    /**
     * The identity matrix for addition.
     * The matrix is locked (immutable), but may be cloned.
     */
    static readonly zero: Matrix3;
}
