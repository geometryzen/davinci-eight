import IMaterial = require('../core/IMaterial')
import IResource = require('../core/IResource')
import IFacet = require('../core/IFacet')

// FIXME: Move to scene folder.
// FIXME. Maybe hide the program and only expose program id?
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
   * @type {IMaterial}
   * Contains a WebGLProgram for each canvas that this IDrawable can draw to.
   */
  material: IMaterial;
  /**
   * User assigned name of the drawable object. Allows an object to be found in a scene.
   * @property name
   * @type [string]
   */
  name: string;
  /**
   * @method draw
   * @param canvasId {number} Determines which canvas the IDrawable should draw to.
   * @return {void}
   */
  draw(canvasId: number): void;
  /**
   * @method getFacet
   * @param name {string}
   * @return {IFacet}
   */
  getFacet(name: string): IFacet;
  /**
   * @method setFacet
   * @param name {string}
   * @param value {IFacet}
   * @return {void}
   */
  setFacet<T extends IFacet>(name: string, value: T): T;
}

export = IDrawable;
