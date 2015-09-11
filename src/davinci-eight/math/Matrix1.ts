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
  addVectors(a: Matrix1, b: Matrix1) {
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
  lerp(target: Matrix1, alpha: number): Matrix1 {
    return this;
  }
  magnitude() {
    return Math.abs(this.data[0]);
  }
  multiply(rhs: Matrix1) {
    return this;
  }
  multiplyScalar(scalar: number) {
    let data = this.data;
    data[0] *= scalar;
    return this;
  }
  quaditude() {
    let x = this.data[0];
    return x * x;
  }
  sub(element: Matrix1) {
    return this;
  }
}

export = Matrix1;