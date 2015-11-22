/**
 * Intentionally undocumented. This interface is for internal consistency only.
 * The methods pertain to a square matrix.
 * The transformation methods are for projective spaces.
 * M is the matrix type.
 * V is a vector of the same dimensionality as the matrix.
 * P is a vector of dimensionality one less than the matrix.
 */
interface Matrix<M, V, P> {
    add(rhs: M): M;
    add2(a: M, b: M): M;
    det(): number;
    inv(): M;
    mul(rhs: M): M;
    mul2(a: M, b: M): M;
    one(): M;
    reflection(vector: P): M;
    translation(vector: P): M;
}
export = Matrix;
