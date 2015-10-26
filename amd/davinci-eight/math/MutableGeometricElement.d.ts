import GeometricElement = require('../math/GeometricElement');
import MutableLinearElement = require('../math/MutableLinearElement');
/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface MutableGeometricElement<I, M, S, V, D> extends GeometricElement<I, M, S, V, D>, MutableLinearElement<I, M, S, V> {
    lco2(a: I, b: I): M;
    rco2(a: I, b: I): M;
    copySpinor(spinor: S): M;
    copyVector(vector: V): M;
    div2(a: I, b: I): M;
    mul2(a: I, b: I): M;
    normalize(): void;
    rotor(b: V, a: V): M;
    rotorFromGeneratorAngle(B: S, θ: number): M;
    scp2(a: I, b: I): M;
    /**
     * The geometric product of the vectors. mulVector2?
     */
    spinor(a: V, b: V): M;
    ext2(a: I, b: I): M;
}
export = MutableGeometricElement;
