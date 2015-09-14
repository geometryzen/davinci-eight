import LinearElement = require('../math/LinearElement');
/**
 * A mutable element of a geometric space.
 */
interface GeometricElement<I, M> extends LinearElement<I, M, I> {
  exp(): M;
  magnitude(): number;
  multiply(rhs: I): M;
  product(a: I, b: I): M;
  quaditude(): number;
}

export = GeometricElement;
