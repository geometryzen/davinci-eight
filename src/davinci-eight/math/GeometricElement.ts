import LinearElement = require('../math/LinearElement');
/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface GeometricElement<I, M, S, V, D> extends LinearElement<I, M, S, V> {
  conj(): M;
  /**
   * divide really only applies to division algebras.
   */
  divide(rhs: I): M;
  divide2(a: I, b: I): M;
  dual(m: D): M;  // Probably should move out since 3D
  exp(): M;
  inv(): M;
  log(): M;
  magnitude(): number;
  multiply(rhs: I): M;
  multiply2(a: I, b: I): M;
  norm(): M;
  normalize(): void;
  quaditude(): number;
  rotor(b: V, a: V): M;
  rotorFromAxisAngle(axis: V, θ: number): M;
  /**
   * The geometric product of the vectors.
   */
  spinor(a: V, b: V): M;
}

export = GeometricElement;
