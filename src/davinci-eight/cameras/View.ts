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
   * @property look
   * @type Cartesian3
   */
  up: Cartesian3;
}

export = View;
