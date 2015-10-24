/**
 * @class Matrix<M>
 */
interface Matrix<M> {
    /**
     * @method determinant
     * @return {number}
     */
    determinant(): number;
    /**
     * @method identity
     * @return {M}
     */
    identity(): M;
    /**
     * @method mul
     * @param rhs {M}
     * @return {M}
     */
    mul(rhs: M): M;
    /**
     * @method mul2
     * @param a {M}
     * @param b {M}
     * @return {M}
     */
    mul2(a: M, b: M): M;
}

export = Matrix;