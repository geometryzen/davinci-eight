import PseudoscalarE3 = require('../math/PseudoscalarE3');
import SpinorE3 = require('../math/SpinorE3');
import VectorE3 = require('../math/VectorE3');
/**
 * @class GeometricE3
 * @extends PseudoscalarE3
 * @extends SpinorE3
 * @extends VectorE3
 */
interface GeometricE3 extends PseudoscalarE3, SpinorE3, VectorE3 {
}
export = GeometricE3;
