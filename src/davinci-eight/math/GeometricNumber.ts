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

/**
 * <h1>
 * Which Geometric Number do I use?
 * </h1>
 *
 * <h2>
 * Introduction
 * </h2>
 * <p>
 * <code>GeometricNumber</code> is an <code>interface</code> used to enforce consistency of the design
 * of various geometric numbers. But why so many implementations? To be continued...
 * </p>
 *
 * <p>
 * </p>
 *
 * <table>
 *   <tr>
 *     <th>Usage:</th>
 *     <th>Calculations</th>
 *     <th>Graphics</th>
 *     <th>WebGL</th>
 *   </tr>
 *   <tr>
 *     <th>Design:</th>
 *     <td>Immutable</td>
 *     <td>Mutable</td>
 *     <td>Mutable</td>
 *   </tr>
 *   <tr>
 *     <th>Euclidean Line:</th>
 *     <td><b>G1</b>, R1</td>
 *     <td><b>Geometric1</b>, Vector1</td>
 *     <td><b>Matrix2</b></td>
 *   </tr>
 *   <tr>
 *     <th>Euclidean Plane:</th>
 *     <td><b>G2</b>, R2</td>
 *     <td><b>Geometric2</b>, Vector2, Spinor2</td>
 *     <td><b>Matrix3</b></td>
 *   </tr>
 *   <tr>
 *     <th>Euclidean Space:</th>
 *     <td><b>G3</b>, R3</td>
 *     <td><b>Geometric3</b>, Vector3, Spinor3</td>
 *     <td><b>Matrix4</b></td>
 *   </tr>
 * </table>
 *
 * @class GeometricNumber
 * @extends LinearNumber
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
