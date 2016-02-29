// Ensures consistency in naming vectors that interact with matrices.
interface ColumnVector<M, V> {
    applyMatrix(σ: M): V;
}

export default ColumnVector;
