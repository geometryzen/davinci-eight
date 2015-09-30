import AbstractMatrix = require('../math/AbstractMatrix')
import Cartesian1 = require('../math/Cartesian1')
import GeometricElement = require('../math/GeometricElement')
import Matrix = require('../math/Matrix')

class Matrix1 extends AbstractMatrix implements Matrix<Matrix1>, GeometricElement<Matrix1, Matrix1, Matrix1, Cartesian1> {
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
  sum(a: Matrix1, b: Matrix1) {
    return this;
  }
  clone() {
    return Matrix1.identity().copy(this);
  }
  copy(m: Matrix1) {
    this.data.set(m.data);
    return this;
  }
  determinant(): number {
    return this.data[0];
  }
  divideScalar(scalar: number) {
    let data = this.data;
    data[0] /= scalar;
    return this;
  }
  exp() {
    return this;
  }
  identity() {
    this.data[0] = 1;
    return this;
  }
  lerp(target: Matrix1, alpha: number): Matrix1 {
    return this;
  }
  magnitude() {
    return Math.abs(this.data[0]);
  }
  multiply(rhs: Matrix1) {
    return this.product(this, rhs);
  }
  scale(scalar: number) {
    let data = this.data;
    data[0] *= scalar;
    return this;
  }
  product(a: Matrix1, b: Matrix1) {
    return this;
  }
  quaditude() {
    let x = this.data[0];
    return x * x;
  }
  reflect(n: Cartesian1): Matrix1 {
    // FIXME: What do we do?
    return this;
  }
  rotate(rotor: Matrix1): Matrix1 {
    return this;
  }
  sub(element: Matrix1) {
    return this;
  }
  difference(a: Matrix1, b: Matrix1) {
    return this;
  }
  spinor(a: Cartesian1, b: Cartesian1): Matrix1 {
    return this;
  }
}

export = Matrix1;