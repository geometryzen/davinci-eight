import LinearElement = require('../math/LinearElement');
/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface GeometricElement<I, M, S, V, D> extends LinearElement<I, M, S, V> {
  conj(): M;
  dual(m: D): M;
  exp(): M;
  inv(): M;
  log(): M;
  magnitude(): number;
  multiply(rhs: I): M;
  norm(): M;
  product(a: I, b: I): M;
  quaditude(): number;
  rotor(b: V, a: V): M;
  rotorFromAxisAngle(axis: V, θ: number): M;
  /**
   * The geometric product of the vectors.
   */
  spinor(a: V, b: V): M;
}

export = GeometricElement;
