import LinearNumber from '../math/LinearNumber';
/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 * Notice that the effect on the target depends upon whether the target class in mutable.
 * I: The lightweight interface form of the concreate class, usually just coordinates.
 * M: The concrete class
 * S: The lightweight interface form of the spinor.
 * V: The lightweight interface form of the vector.
 * MAGNITUDE: The type for methods that compute magnitudes.
 */

interface GeometricNumber<I, M, S, V, MAGNITUDE, SCALING, UNIT> extends LinearNumber<I, M, S, V, MAGNITUDE, SCALING> {

    /**
     * Addition of a scalar.
     */
    addScalar(α: UNIT): M;

    /**
     * conjugate multiplied by norm (similar to inv)
     */
    adj(): M;

    /**
     * Assumes a spinor as the multivector.
     * angle(M) = log(M).grade(2)
     * In other words, throw away the scalar part of the result which is the scaling.
     */
    angle(): M;

    /**
     * Conjugate
     */
    conj(): M;

    /**
     * Left contraction
     */
    lco(rhs: I): M;

    /**
     * divide really only applies to division algebras, may not be defined.
     */
    div(rhs: I): M;

    /**
     * Exponential
     */
    exp(): M;

    /**
     * Exterior or Outer Product.
     */
    ext(rhs: I): M;

    /**
     * extraction of grade.
     */
    grade(grade: number): M;

    /**
     * Inverse (may not exist).
     */
    inv(): M;

    /**
     *
     */
    isOne(): boolean;

    /**
     *
     */
    isZero(): boolean;

    /**
     * Natural logarithm.
     */
    log(): M;

    /**
     * Computes the square root of the squared norm.
     */
    magnitude(): MAGNITUDE;

    /**
     * Multiplication.
     */
    mul(rhs: I): M;

    /**
     * norm, ||x|| = sqrt(scp(x, rev(x)))
     */
    norm(): M;

    /**
     * squared norm, scp(x, rev(x))
     */
    quad(): M;

    /**
     * Right contraction
     */
    rco(rhs: I): M;

    /**
     * Reverse
     */
    rev(): M;

    /**
     * squared norm, scp(x, rev(x))
     */
    squaredNorm(): MAGNITUDE;

    /**
     * Scalar Product
     */
    scp(rhs: I): M;
}

export default GeometricNumber;
