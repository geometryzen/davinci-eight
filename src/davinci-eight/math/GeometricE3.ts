import Pseudo from '../math/Pseudo';
import Scalar from '../math/Scalar';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

/**
 * @class GeometricE3
 * @extends Pseudo
 * @extends Scalar
 * @extends SpinorE3
 * @extends VectorE3
 */
interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {
}

export default GeometricE3;
