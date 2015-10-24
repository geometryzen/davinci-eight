interface LinearElement<I, M, S, V> {
    add(rhs: I, α?: number): M;
    lerp(target: I, α: number): M;
    neg(): M;
    reflect(n: V): M;
    rotate(rotor: S): M;
    sub(rhs: I, α?: number): M;
}
export = LinearElement;
