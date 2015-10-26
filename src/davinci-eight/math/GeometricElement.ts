import LinearElement = require('../math/LinearElement');
/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface GeometricElement<I, M, S, V, D> extends LinearElement<I, M, S, V> {

  /**
   * The principle value of the rotation angle caused by a rotor.
   */
  arg(): number;

  /**
   * conjugate multiplied by norm (similar to inv)
   */
  adj(): M;

  /**
   * Conjugate
   */
  conj(): M;

  /**
   * Left contraction
   */
  lco(rhs: I): M;

  /**
   * divide really only applies to division algebras, may not be defined.
   */
  div(rhs: I): M;

  /**
   * Duality
   */
  dual(m: D): M;
  /**
   * Exponential
   */
  exp(): M;

  /**
   * Exterior or Outer Product.
   */
  ext(rhs: I): M;

  /**
   * Inverse (may not exist).
   */
  inv(): M;

  /**
   * Natural logarithm.
   */
  log(): M;

  /**
   * abs(x) = |x|, absolute value of the norm.
   */
  magnitude(): number; // FIXME: This method drops units.

  /**
   * Multiplication.
   */
  mul(rhs: I): M;

  /**
   * norm, ||x|| = sqrt(scp(x, rev(x)))
   */
  norm(): M;

  /**
   * squared norm, scp(x, rev(x))
   */
  quad(): M;

  /**
   * squared norm, as a number
   */
  quaditude(): number; // FIXME: This method drops units. Some authors might call this `det`

  /**
   * Right contraction
   */
  rco(rhs: I): M;

  /**
   * Reverse
   */
  rev(): M;

  /**
   * Scalar Product
   */
  scp(rhs: I): M;
}

export = GeometricElement;
