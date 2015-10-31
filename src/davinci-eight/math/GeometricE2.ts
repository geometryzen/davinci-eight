import Pseudo = require('../math/Pseudo')
import Scalar = require('../math/Scalar')
import SpinorE2 = require('../math/SpinorE2')
import VectorE2 = require('../math/VectorE2')

/**
 * @class GeometricE2
 * @extends Pseudo
 * @extends Scalar
 * @extends SpinorE2
 * @extends VectorE2
 */
interface GeometricE2 extends Pseudo, Scalar, SpinorE2, VectorE2 {
}

export = GeometricE2;