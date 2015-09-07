import LinearElement = require('../math/LinearElement');
/**
 * A mutable element of a geometric space.
 */
interface GeometricElement<I, M> extends LinearElement<I, M> {
    exp(): M;
    multiply(element: I): M;
}
export = GeometricElement;
