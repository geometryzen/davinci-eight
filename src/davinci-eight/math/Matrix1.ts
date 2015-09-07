import AbstractMatrix = require('../math/AbstractMatrix');
import GeometricElement = require('../math/GeometricElement');

class Matrix1 extends AbstractMatrix implements GeometricElement<Matrix1, Matrix1> {
  /**
   * Constructs a Matrix1 by wrapping a Float32Array.
   * @constructor
   */
  constructor(data: Float32Array) {
    super(data, 1);
  }
  public static identity(): Matrix1 {
    return new Matrix1(new Float32Array([1]));
  }
  add(element: Matrix1) {
    return this;
  }
  clone() {
    return Matrix1.identity().copy(this);
  }
  copy(m: Matrix1) {
    this.data.set(m.data);
    return this;
  }
  divideScalar(scalar: number) {
    let data = this.data;
    data[0] /= scalar;
    return this;
  }
  exp() {
    return this;
  }
  multiply(rhs: Matrix1) {
    return this;
  }
  multiplyScalar(scalar: number) {
    let data = this.data;
    data[0] *= scalar;
    return this;
  }
}

export = Matrix1;