/**
 * Intentionally undocumented. This interface is for internal consistency only.
 * Note that the methods pertain to a square matrix.
 */
interface Matrix<M> {
    det(): number;
    inv(): M;
    mul(rhs: M): M;
    mul2(a: M, b: M): M;
    one(): M;
}
export = Matrix;
