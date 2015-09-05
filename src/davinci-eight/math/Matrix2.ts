import AbstractMatrix = require('../math/AbstractMatrix');

class Matrix2 extends AbstractMatrix {
  /**
   * Constructs a Matrix2 by wrapping a Float32Array.
   * @constructor
   */
  constructor(data: Float32Array) {
    super(data, 4);
  }
}

export = Matrix2;
