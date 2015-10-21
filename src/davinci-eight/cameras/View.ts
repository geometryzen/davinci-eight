import IFacet = require('../core/IFacet');
import MutableVectorE3 = require('../math/MutableVectorE3');
import VectorE3 = require('../math/VectorE3');
import MutableSpinorE3 = require('../math/MutableSpinorE3');
import SpinorE3 = require('../math/SpinorE3');

/**
 * @class View
 */
interface View extends IFacet {
  /**
   * @property eye
   * @type MutableVectorE3
   */
  eye: MutableVectorE3;
  /**
   * @property look
   * @type MutableVectorE3
   */
  look: MutableVectorE3;
  /**
   * @property up
   * @type MutableVectorE3
   */
  up: MutableVectorE3;
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
