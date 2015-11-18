/**
 * Intentionally undocumented. This interface is for internal consistency only.
 * Note that the methods pertain to a square matrix.
 */
interface Matrix<M, V> {
    det(): number;
    inv(): M;
    mul(rhs: M): M;
    mul2(a: M, b: M): M;
    one(): M;
    reflection(vector: V): M;
}
export = Matrix;
