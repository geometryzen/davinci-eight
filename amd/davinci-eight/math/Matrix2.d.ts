import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import Ring = require('../math/MutableRingElement');
/**
 * @class Matrix2
 * @extends AbstractMatrix
 */
declare class Matrix2 extends AbstractMatrix implements Matrix<Matrix2>, Ring<Matrix2> {
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
    determinant(): number;
    one(): Matrix2;
    set(n11: number, n12: number, n21: number, n22: number): Matrix2;
    mul(rhs: Matrix2): Matrix2;
    mul2(a: Matrix2, b: Matrix2): Matrix2;
}
export = Matrix2;
