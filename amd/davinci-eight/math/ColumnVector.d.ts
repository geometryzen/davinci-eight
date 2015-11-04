interface ColumnVector<M, V> {
    applyMatrix(matrix: M): V;
}
export = ColumnVector;
