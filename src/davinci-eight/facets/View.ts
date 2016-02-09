import Facet from '../core/Facet';
import R3 from '../math/R3';
import VectorE3 from '../math/VectorE3';

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class View
 */
interface View extends Facet {

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

export default View;
