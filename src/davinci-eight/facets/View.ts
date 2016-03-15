import ControlsTarget from '../controls/ControlsTarget'
import Facet from '../core/Facet';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';
import Matrix4 from '../math/Matrix4';

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class View
 */
interface View extends Facet, ControlsTarget {

  /**
   * @property eye
   * @type Vector3
   */
  eye: Vector3;

  /**
   * @property look
   * @type Vector3
   */
  look: Vector3;

  /**
   * @property up
   * @type Vector3
   */
  up: Vector3;

  /**
   * @property viewMatrix
   * @type Matrix4
   * @readOnly
   */
  viewMatrix: Matrix4;

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

export default View;
