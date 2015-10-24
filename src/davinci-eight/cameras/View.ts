import IFacet = require('../core/IFacet');
import R3 = require('../math/R3');
import VectorE3 = require('../math/VectorE3');
import SpinG3 = require('../math/SpinG3');
import SpinorE3 = require('../math/SpinorE3');

/**
 * @class View
 */
interface View extends IFacet {
  /**
   * @property eye
   * @type R3
   */
  eye: R3;
  /**
   * @property look
   * @type R3
   */
  look: R3;
  /**
   * @property up
   * @type R3
   */
  up: R3;
  /**
   * Convenience method for setting the eye property allowing chainable method calls.
   * @method setEye
   * @param eye {VectorE3}
   */
  setEye(eye: VectorE3): View;
  /**
   * Convenience method for setting the look property allowing chainable method calls.
   * @method setLook
   * @param look {VectorE3}
   */
  setLook(look: VectorE3): View;
  /**
   * Convenience method for setting the up property allowing chainable method calls.
   * @method setUp
   * @param up {VectorE3}
   */
  setUp(up: VectorE3): View;
}

export = View;
