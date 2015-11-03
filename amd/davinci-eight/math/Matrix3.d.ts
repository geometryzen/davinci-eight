import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import Matrix4 = require('./Matrix4');
/**
 * @class Matrix3
 * @extends AbstractMatrix
 */
declare class Matrix3 extends AbstractMatrix implements Matrix<Matrix3> {
    /**
     * 3x3 (square) matrix of numbers.
     * Constructs a Matrix3 by wrapping a Float32Array.
     * @class Matrix3
     * @constructor
     */
    constructor(elements: Float32Array);
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method identity
     * @return {Matrix3}
     * @static
     */
    static identity(): Matrix3;
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Matrix3}
     * @static
     */
    static zero(): Matrix3;
    determinant(): number;
    getInverse(matrix: Matrix4, throwOnInvertible?: boolean): Matrix3;
    identity(): Matrix3;
    mul(rhs: Matrix3): Matrix3;
    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {number[]}
     */
    row(i: number): number[];
    scale(s: number): Matrix3;
    mul2(a: Matrix3, b: Matrix3): Matrix3;
    normalFromMatrix4(m: Matrix4): void;
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): Matrix3;
    toString(): string;
    transpose(): Matrix3;
}
export = Matrix3;
