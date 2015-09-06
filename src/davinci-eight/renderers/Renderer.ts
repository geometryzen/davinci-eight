import RenderingContextUser = require('../core/RenderingContextUser');
import DrawList = require('../drawLists/DrawList'); 
/**
 * @class Renderer
 * @extends RenderingContextUser
 */
interface Renderer extends RenderingContextUser {
  /**
   * The (readonly) cached WebGLRenderingContext. The context may sometimes be undefined.
   */
  context: WebGLRenderingContext;
   /**
   * @property autoClear
   * Defines whether the renderer should automatically clear its output before rendering.
   */
  autoClear: boolean;
  /**
   *
   */
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  /**
   * Render the contents of the drawList.
   * This is a convenience method that calls clear and then traverses the DrawList calling draw on each Drawable.
   */
  render(drawList: DrawList): void;
}

export = Renderer;