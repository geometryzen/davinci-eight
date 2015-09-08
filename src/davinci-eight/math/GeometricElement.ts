import LinearElement = require('../math/LinearElement');
/**
 * A mutable element of a geometric space.
 */
interface GeometricElement<I, M> extends LinearElement<I, M> {
  exp(): M;
  magnitude(): number;
  multiply(element: I): M;
  quaditude(): number;
}

export = GeometricElement;
