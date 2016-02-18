import Facet from '../core/Facet';
import R3m from '../math/R3m';
import VectorE3 from '../math/VectorE3';
import Mat4R from '../math/Mat4R';

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
     * @type R3m
     */
    eye: R3m;

    /**
     * @property look
     * @type R3m
     */
    look: R3m;

    /**
     * @property up
     * @type R3m
     */
    up: R3m;

    /**
     * @property viewMatrix
     * @type Mat4R
     * @readOnly
     */
    viewMatrix: Mat4R;

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
