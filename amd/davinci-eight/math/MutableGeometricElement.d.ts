import GeometricElement = require('../math/GeometricElement');
import MutableLinearElement = require('../math/MutableLinearElement');
/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface MutableGeometricElement<I, M, S, V, D> extends GeometricElement<I, M, S, V, D>, MutableLinearElement<I, M, S, V> {
    conL2(a: I, b: I): M;
    conR2(a: I, b: I): M;
    div2(a: I, b: I): M;
    mul2(a: I, b: I): M;
    normalize(): void;
    rotor(b: V, a: V): M;
    rotorFromAxisAngle(axis: V, θ: number): M;
    align2(a: I, b: I): M;
    /**
     * The geometric product of the vectors.
     */
    spinor(a: V, b: V): M;
    wedge2(a: I, b: I): M;
}
export = MutableGeometricElement;
