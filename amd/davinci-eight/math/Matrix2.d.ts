import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import Ring = require('../math/MutableRingElement');
import RingOperators = require('../math/RingOperators');
/**
 * @class Matrix2
 * @extends AbstractMatrix
 */
declare class Matrix2 extends AbstractMatrix implements Matrix<Matrix2>, Ring<Matrix2>, RingOperators<Matrix2> {
    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Matrix2 by wrapping a Float32Array.
     * @class Matrix2
     * @constructor
     */
    constructor(elements: Float32Array);
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Matrix2}
     * @static
     */
    static one(): Matrix2;
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Matrix2}
     * @static
     */
    static zero(): Matrix2;
    /**
     * @method add
     * @param rhs {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    add(rhs: Matrix2): Matrix2;
    clone(): Matrix2;
    /**
     * @method determinant
     * @return {number}
     */
    determinant(): number;
    /**
     * @method inv
     * @return {Matrix2}
     * @chainable
     */
    inv(): Matrix2;
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
     * @param rhs {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    mul(rhs: Matrix2): Matrix2;
    /**
     * @method mul2
     * @param a {Matrix2}
     * @param b {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    mul2(a: Matrix2, b: Matrix2): Matrix2;
    /**
     * @method neg
     * @return {Matrix2}
     * @chainable
     */
    neg(): Matrix2;
    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Matrix2}
     * @chainable
     */
    one(): Matrix2;
    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {Array<number>}
     */
    row(i: number): Array<number>;
    /**
     * @method scale
     * @param α {number}
     * @return {Matrix2}
     * @chainable
     */
    scale(α: number): Matrix2;
    /**
     * @method set
     * @param n11 {number}
     * @param n12 {number}
     * @param n21 {number}
     * @param n22 {number}
     * @return {Matrix2}
     * @chainable
     */
    set(n11: number, n12: number, n21: number, n22: number): Matrix2;
    /**
     * @method sub
     * @param rhs {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    sub(rhs: Matrix2): Matrix2;
    /**
     * @method toString
     * @return {string}
     */
    toString(): string;
    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Matrix2}
     * @chainable
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
}
export = Matrix2;
