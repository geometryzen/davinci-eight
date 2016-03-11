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
    clone(): M;
    copy(m: M): M;
    // copyElements(matrix: {elements: Float32Array; dimensions: number}): M;
    det(): number;
    inv(): M;
    mul(rhs: M): M;
    mul2(a: M, b: M): M;
    one(): M;
    reflection(vector: P): M;
    // rmul(lhs: M): M;
    scale(s: number): M;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
    // translate(vector: d): M;
    translation(vector: P): M;
    // transpose(): M;
    zero(): M;
}

export default Matrix;
