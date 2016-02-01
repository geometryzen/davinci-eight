/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 * Notice that the effect on the target depends upon whether the target class in mutable.
 */
interface LinearElement<I, M, S, V> {
    /**
     * addition, with an optional weight for the rhs.
     */
    add(rhs: I, α?: number): M;
    divByScalar(α: number): M;
    lerp(target: I, α: number): M;
    /**
     * The additive inverse.
     */
    neg(): M;
    reflect(n: V): M;
    rotate(rotor: S): M;
    scale(α: number): M;
    slerp(target: I, α: number): M;
    sub(rhs: I, α?: number): M;
    toExponential(): string
    toFixed(digits?: number): string;
    toString(): string;
}

export default LinearElement;
