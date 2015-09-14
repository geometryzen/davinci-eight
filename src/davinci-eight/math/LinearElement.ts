/**
 * A mutable element of a linear space.
 */
interface LinearElement<I, M, S> {
  add(rhs: I): M;
  clone(): M;
  copy(source: I): M;
  difference(a: I, b: I): M;
  divideScalar(scalar: number): M;
  lerp(target: I, alpha: number): M;
  multiplyScalar(scalar: number): M;
//reflect(vector: I): M;
  rotate(rotor: S): M;
  sub(rhs: I): M;
  sum(a: I, b: I): M;
}

export = LinearElement;