import View = require('../cameras/View');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @class Frustum
 * @extends Camera
 */
interface Frustum extends View {
    /**
     * @property left
     * @type number
     */
    left: number;
    /**
     * @property right
     * @type number
     */
    right: number;
    /**
     * @property bottom
     * @type number
     */
    bottom: number;
    /**
     * @property top
     * @type number
     */
    top: number;
    /**
     * @property near
     * @type number
     */
    near: number;
    /**
     * @property far
     * @type number
     */
    far: number;
    /**
     * Convenience method for setting the eye property allowing chainable method calls.
     * @method setEye
     * @param eye {Cartesian3}
     */
    setEye(eye: Cartesian3): Frustum;
    /**
     * Convenience method for setting the look property allowing chainable method calls.
     * @method setLook
     * @param look {Cartesian3}
     */
    setLook(look: Cartesian3): Frustum;
    /**
     * Convenience method for setting the up property allowing chainable method calls.
     * @method setUp
     * @param up {Cartesian3}
     */
    setUp(up: Cartesian3): Frustum;
}
export = Frustum;
