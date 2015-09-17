import IDrawable = require('../core/IDrawable');
/**
 * @interface ICamera
 * @extends IDrawable
 *
 * Supports IDrawable so that all cameras can be added to the scene graph.
 */
interface ICamera extends IDrawable {
}

export = ICamera;
