import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
declare class Matrix2 extends AbstractMatrix implements Matrix<Matrix2> {
    /**
     * Constructs a Matrix2 by wrapping a Float32Array.
     * @constructor
     */
    constructor(data: Float32Array);
    determinant(): number;
    identity(): Matrix2;
    multiply(rhs: Matrix2): Matrix2;
    product(a: Matrix2, b: Matrix2): Matrix2;
}
export = Matrix2;
