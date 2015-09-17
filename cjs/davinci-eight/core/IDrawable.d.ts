import IProgram = require('../core/IProgram');
import IResource = require('../core/IResource');
/**
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGLRenderingContext.
 * It also contains other meta-data that may be used to optimize the rendering.
 * e.g. transparency, visibility, bounding volumes, etc.
 *
 *
 * @interface Drawable
 * @extends IResource
 */
interface IDrawable extends IResource {
    /**
     * @property material
     */
    material: IProgram;
    /**
     * @method accept
     * @param visitor {DrawableVisitor}
     */
    draw(): any;
}
export = IDrawable;
