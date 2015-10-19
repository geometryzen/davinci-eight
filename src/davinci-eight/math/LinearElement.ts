/**
 * A mutable element of a linear space.
 * @class LinearElement<I, M, S>
 */
interface LinearElement<I, M, S, V> {
  /**
   * <p>
   * Adds <code>alpha * rhs</code> to <code>this</code> linear element.
   * </p>
   * @param rhs {I}
   * @param alpha {number}
   * @return {M}
   */
  add(rhs: I, alpha: number): M;
  clone(): M;
  copy(source: I): M;
  difference(a: I, b: I): M;
  divideScalar(scalar: number): M;
  lerp(target: I, alpha: number): M;
  /**
   * @method scale
   * @param scalar {number}
   * @return {M}
   */
  scale(scalar: number): M;
  /**
   * <p>
   * Changes <code>this</code> instance into the result of reflecting in the
   * plane or subspace perpendicular to <code>n</code>. 
   * </p>
   * @method reflect
   * @param n {V} a vector that is considered to be normal to the reflecting plane.
   * @return {M}
   */
  reflect(n: V): M;
  /**
   * @method rotate
   * @param rotor {S}
   * @return {M}
   */
  rotate(rotor: S): M;
  sub(rhs: I): M;
  sum(a: I, b: I): M;
}

export = LinearElement;