interface LinearElement<I, M, S, V> {
  add(rhs: I, α?: number): M;
  // FIXME: Add α and β as final parameters? Otherwise it's just a convenience.
  add2(a: I, b: I): M;
  clone(): M;
  copy(source: I): M;
  divideByScalar(α: number): M;
  lerp(target: I, α: number): M;
  // FIXME: This can be done through copy(a).lerp(b, α), so it's just a convenience. Add β.
  lerp2(a: I, b: I, α: number): M;
  scale(α: number): M;
  reflect(n: V): M;
  rotate(rotor: S): M;
  sub(rhs: I, α?: number): M;
  sub2(a: I, b: I): M;
}

export = LinearElement;