import IProgram = require('../core/IProgram');
import IResource = require('../core/IResource');

// FIXME: Move to scene folder.
// FIXME. Maybe hide the program and only expose program id?
/**
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGL rendering context.
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
   *
   * Contains a WebGLProgram for each canvas that this IDrawable can draw to.
   */
  material: IProgram;
  /**
   * @method accept
   * @param canvasId {number} Determines which canvas the IDrawable should draw to.
   */
  draw(canvasId: number);
}

export = IDrawable;
