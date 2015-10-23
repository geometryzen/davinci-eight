interface LinearElement<I, M, S, V> {
    add(rhs: I, α?: number): M;
    add2(a: I, b: I): M;
    clone(): M;
    copy(source: I): M;
    divideByScalar(α: number): M;
    lerp(target: I, α: number): M;
    lerp2(a: I, b: I, α: number): M;
    scale(α: number): M;
    reflect(n: V): M;
    rotate(rotor: S): M;
    sub(rhs: I, α?: number): M;
    sub2(a: I, b: I): M;
}
export = LinearElement;
