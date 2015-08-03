import UniformProvider = require('../core/UniformProvider');
import Vector3 = require('../math/Vector3');
import Cartesian3 = require('../math/Cartesian3');
import Spinor3 = require('../math/Spinor3');
import Spinor3Coords = require('../math/Spinor3Coords');

/**
 * @class View
 */
interface View extends UniformProvider {
  /**
   * @property eye
   * @type Cartesian3
   */
  eye: Cartesian3;
  /**
   * @property look
   * @type Cartesian3
   */
  look: Cartesian3;
  /**
   * @property up
   * @type Cartesian3
   */
  up: Cartesian3;
  /**
   * Convenience method for setting the eye property allowing chainable method calls.
   * @method setEye
   * @param eye {Cartesian3}
   */
  setEye(eye: Cartesian3): View;
  /**
   * Convenience method for setting the look property allowing chainable method calls.
   * @method setLook
   * @param look {Cartesian3}
   */
  setLook(look: Cartesian3): View;
  /**
   * Convenience method for setting the up property allowing chainable method calls.
   * @method setUp
   * @param up {Cartesian3}
   */
  setUp(up: Cartesian3): View;
}

export = View;
