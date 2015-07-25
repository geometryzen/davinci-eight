import View = require('../cameras/View');
import Cartesian3 = require('../math/Cartesian3');
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
    /**
     * Convenience method for setting the aspect property allowing chainable method calls.
     * @method setAspect
     * @param aspect {number}
     */
    setAspect(aspect: number): LinearPerspectiveCamera;
    /**
     * Convenience method for setting the eye property allowing chainable method calls.
     * @method setEye
     * @param eye {{x:number;y:number;z:number}}
     */
    setEye(eye: Cartesian3): LinearPerspectiveCamera;
}
export = LinearPerspectiveCamera;
