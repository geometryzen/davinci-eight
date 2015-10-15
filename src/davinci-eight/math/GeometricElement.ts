import LinearElement = require('../math/LinearElement');
/**
 * A mutable element of a geometric space.
 */
interface GeometricElement<I, M, S, V, D> extends LinearElement<I, M, S, V> {
  exp(): M;
  dual(m: D): M;
  log(): M;
  magnitude(): number;
  multiply(rhs: I): M;
  product(a: I, b: I): M;
  quaditude(): number;
  rotor(b: V, a: V): M;
  spinor(a: V, b: V): M;
}

export = GeometricElement;
