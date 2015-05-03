interface GeometricQuantity<T> {
    /**
     * The `add` method computes the sum of this GeometricQuantity and the `rhs` GeometricQuantity.
     */
    add(rhs: T): T;
    /**
     * The `norm` method computes the magnitude of the GeometricQuantity.
     */
    norm(): T;
    /**
     * The `quad` method computes the quadrance of the GeometricQuantity.
     * The quadrance is the square of the norm.
     */
    quad(): T;
}
export = GeometricQuantity;
