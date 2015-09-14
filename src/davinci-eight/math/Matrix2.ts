import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');

class Matrix2 extends AbstractMatrix implements Matrix<Matrix2> {
  /**
   * Constructs a Matrix2 by wrapping a Float32Array.
   * @constructor
   */
  constructor(data: Float32Array) {
    super(data, 4);
  }
  determinant(): number {
    return 1;
  }
  identity() {
    return this;
  }
  multiply(rhs: Matrix2): Matrix2 {
    return this.product(this, rhs);
  }
  product(a: Matrix2, b: Matrix2): Matrix2 {
    return this;
  }
}

export = Matrix2;
