import GeometricNumber from '../math/GeometricNumber';
import MutableLinearElement from '../math/MutableLinearElement';
import MutableRingElement from '../math/MutableRingElement';

/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface MutableGeometricElement<I, M, S, V, MAGNITUDE, SCALING, UNIT> extends GeometricNumber<I, M, S, V, MAGNITUDE, SCALING, UNIT>, MutableLinearElement<I, M, S, V, MAGNITUDE, SCALING>, MutableRingElement<M> {

    /**
     * Sets this multivector to the left contraction of the multivectors.
     */
    lco2(a: I, b: I): M;

    /**
     * Sets this multivector to the right contraction of the multivectors.
     */
    rco2(a: I, b: I): M;

    /**
     * Sets this multivector to the value of the scalar, <code>α</code>.
     */
    copyScalar(α: number): M;

    /**
     * Sets this multivector to the value of the spinor.
     */
    copySpinor(spinor: S): M;

    /**
     * Sets this multivector to the value of the vector.
     */
    copyVector(vector: V): M;

    /**
     * Sets this multivector to this / norm(this)
     */
    normalize(): M;

    /**
     * Sets this multivector to a / b. This may not be defined.
     */
    div2(a: I, b: I): M;

    /**
     * Sets this multivector to the geometric product of the multivectors.
     */
    mul2(a: I, b: I): M;

    /**
     * Sets this multivector to a unitary spinor (a rotor), even if the vectors are not unitary.
     */
    rotorFromDirections(a: V, b: V): M;

    /**
     * Sets this multivector to a unitary spinor (a rotor).
     */
    rotorFromGeneratorAngle(B: S, θ: number): M;

    /**
     * Sets this multivector to the scalar product of the multivectors.
     */
    scp2(a: I, b: I): M;

    /**
     * Sets this multivector to the geometric product of the vectors.
     */
    versor(a: V, b: V): M;

    /**
     * Sets this multivector to the exterior product of the multivectors.
     */
    ext2(a: I, b: I): M;
}

export default MutableGeometricElement;
