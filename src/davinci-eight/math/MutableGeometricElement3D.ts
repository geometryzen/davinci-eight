import MutableGeometricElement from '../math/MutableGeometricElement';
import MutableLinearElement from '../math/MutableLinearElement';

/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface MutableGeometricElement3D<I, M, S, V, MAGNITUDE, SCALING, UNIT> extends MutableGeometricElement<I, M, S, V, MAGNITUDE, SCALING, UNIT>, MutableLinearElement<I, M, S, V, MAGNITUDE, SCALING> {
    /**
     * In 3D the dual of the axis is well defined.
     */
    rotorFromAxisAngle(axis: V, θ: number): M;
}

export default MutableGeometricElement3D;
