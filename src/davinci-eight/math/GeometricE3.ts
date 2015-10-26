import PseudoE3 = require('../math/PseudoE3')
import SpinorE3 = require('../math/SpinorE3')
import VectorE3 = require('../math/VectorE3')

/**
 * @class GeometricE3
 * @extends PseudoE3
 * @extends SpinorE3
 * @extends VectorE3
 */
interface GeometricE3 extends PseudoE3, SpinorE3, VectorE3 {
}

export = GeometricE3;