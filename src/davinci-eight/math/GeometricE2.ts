import Pseudo from '../math/Pseudo';
import Scalar from '../math/Scalar';
import SpinorE2 from '../math/SpinorE2';
import VectorE2 from '../math/VectorE2';

/**
 * @class GeometricE2
 * @extends Pseudo
 * @extends Scalar
 * @extends SpinorE2
 * @extends VectorE2
 */
interface GeometricE2 extends Pseudo, Scalar, SpinorE2, VectorE2 {
}

export default GeometricE2;
