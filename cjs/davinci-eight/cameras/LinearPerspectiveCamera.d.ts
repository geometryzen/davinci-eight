import View = require('../cameras/View');
/**
 * @class LinearPerspectiveCamera
 * @extends Camera
 */
interface LinearPerspectiveCamera extends View {
    /**
     * @property fov
     * @type number
     */
    fov: number;
    /**
     * @property aspect
     * @type number
     */
    aspect: number;
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
export = LinearPerspectiveCamera;
