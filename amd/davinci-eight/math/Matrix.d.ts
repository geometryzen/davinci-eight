/**
 * @class Matrix<M>
 */
interface Matrix<M> {
    determinant(): number;
    identity(): M;
    multiply(rhs: M): M;
    product(a: M, b: M): M;
}
export = Matrix;
