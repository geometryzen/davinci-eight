import PseudoE2 = require('../math/PseudoE2');
import SpinorE2 = require('../math/SpinorE2');
import VectorE2 = require('../math/VectorE2');
/**
 * @class GeometricE2
 * @extends PseudoE2
 * @extends SpinorE2
 * @extends VectorE2
 */
interface GeometricE2 extends PseudoE2, SpinorE2, VectorE2 {
}
export = GeometricE2;
