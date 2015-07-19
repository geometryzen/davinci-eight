import View = require('../cameras/View');
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
}
export = Frustum;
