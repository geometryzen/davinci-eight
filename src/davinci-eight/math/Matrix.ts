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
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {M}
     */
    one(): M;

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