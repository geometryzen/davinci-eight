// Ensures consistency in naming vectors that interact with matrices.
interface ColumnVector<M, V> {
    applyMatrix(matrix: M): V;
}

export default ColumnVector;
