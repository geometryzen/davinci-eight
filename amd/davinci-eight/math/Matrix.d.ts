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
     * @method multiply
     * @param rhs {M}
     * @return {M}
     */
    multiply(rhs: M): M;
    /**
     * @method product
     * @param a {M}
     * @param b {M}
     * @return {M}
     */
    product(a: M, b: M): M;
}
export = Matrix;
