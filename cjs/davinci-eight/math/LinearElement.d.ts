/**
 * A mutable element of a linear space.
 */
interface LinearElement<I, M> {
    add(rhs: I): M;
    clone(): M;
    copy(source: I): M;
    divideScalar(scalar: number): M;
    lerp(target: I, alpha: number): M;
    multiplyScalar(scalar: number): M;
    sub(rhs: I): M;
}
export = LinearElement;
