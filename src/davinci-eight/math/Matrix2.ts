import AbstractMatrix = require('../math/AbstractMatrix');
import VectorE2 = require('../math/VectorE2')
import GeometricElement = require('../math/GeometricElement')
import Matrix = require('../math/Matrix');
import Ring = require('../math/MutableRingElement');

/**
 * @class Matrix2
 * @extends AbstractMatrix
 */
class Matrix2 extends AbstractMatrix implements Matrix<Matrix2>, Ring<Matrix2> {
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
     * @method one
     * @return {Matrix2}
     * @static
     */
    public static one(): Matrix2 {
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
    one() {
        return this.set(1, 0, 0, 1)
    }
    set(n11: number, n12: number, n21: number, n22: number): Matrix2 {
        var te = this.elements;
        te[0x0] = n11; te[0x2] = n12;
        te[0x1] = n21; te[0x3] = n22;
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
