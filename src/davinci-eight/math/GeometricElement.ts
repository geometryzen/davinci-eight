import LinearElement = require('../math/LinearElement');
/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface GeometricElement<I, M, S, V, D> extends LinearElement<I, M, S, V> {
  conj(): M;
  conL(rhs: I): M;
  conR(rhs: I): M;
  /**
   * divide really only applies to division algebras.
   */
  div(rhs: I): M;
  dual(m: D): M;  // Probably should move out since 3D
  exp(): M;
  inv(): M;
  log(): M;
  magnitude(): number; // FIXME: This method drops units.
  mul(rhs: I): M;
  norm(): M;
  quaditude(): number; // FIXME: This method drops units
  align(rhs: I): M;
  wedge(rhs: I): M;
}

export = GeometricElement;
