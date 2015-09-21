import IProgram = require('../core/IProgram');
import IResource = require('../core/IResource');
/**
 * <p>
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGL rendering context.
 * It also contains other meta-data that may be used to optimize the rendering.
 * e.g. transparency, visibility, bounding volumes, etc.
 * </p>
 *
 * @class IDrawable
 * @extends IResource
 */
interface IDrawable extends IResource {
    /**
     * @property material
     * @type {IProgram}
     * Contains a WebGLProgram for each canvas that this IDrawable can draw to.
     */
    material: IProgram;
    /**
     * @method draw
     * @param canvasId {number} Determines which canvas the IDrawable should draw to.
     * @return {void}
     */
    draw(canvasId: number): void;
}
export = IDrawable;
