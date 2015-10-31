import Pseudo = require('../math/Pseudo');
import Scalar = require('../math/Scalar');
import SpinorE3 = require('../math/SpinorE3');
import VectorE3 = require('../math/VectorE3');
/**
 * @class GeometricE3
 * @extends Pseudo
 * @extends Scalar
 * @extends SpinorE3
 * @extends VectorE3
 */
interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {
}
export = GeometricE3;
