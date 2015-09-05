import AbstractMatrix = require('../math/AbstractMatrix');

class Matrix1 extends AbstractMatrix {
  /**
   * Constructs a Matrix1 by wrapping a Float32Array.
   * @constructor
   */
  constructor(data: Float32Array) {
    super(data, 1);
  }
}

export = Matrix1;