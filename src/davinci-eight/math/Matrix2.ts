import AbstractMatrix = require('../math/AbstractMatrix');
import VectorE2 = require('../math/VectorE2')
import GeometricElement = require('../math/GeometricElement')
import Matrix = require('../math/Matrix');

/**
 * @class Matrix2
 * @extends AbstractMatrix
 */
class Matrix2 extends AbstractMatrix implements Matrix<Matrix2> {
    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Matrix2 by wrapping a Float32Array.
     * @class Matrix2
     * @constructor
     */
    constructor(elements: Float32Array) {
        super(elements, 2);
    }
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method identity
     * @return {Matrix2}
     * @static
     */
    public static identity(): Matrix2 {
        return new Matrix2(new Float32Array([1, 0, 0, 1]));
    }
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Matrix2}
     * @static
     */
    public static zero(): Matrix2 {
        return new Matrix2(new Float32Array([0, 0, 0, 0]));
    }
    determinant(): number {
        return 1;
    }
    identity() {
        return this;
    }
    mul(rhs: Matrix2): Matrix2 {
        return this.mul2(this, rhs);
    }
    mul2(a: Matrix2, b: Matrix2): Matrix2 {
        return this;
    }
}

export = Matrix2;
