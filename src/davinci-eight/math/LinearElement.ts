/**
 * A mutable element of a linear space.
 */
interface LinearElement<I, M> {
  add(element: I): M;
  clone(): M;
  copy(source: I): M;
  divideScalar(scalar: number): M;
  multiplyScalar(scalar: number): M;
}

export = LinearElement;