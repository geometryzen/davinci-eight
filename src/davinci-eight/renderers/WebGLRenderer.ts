import RenderingContextUser = require('../core/RenderingContextUser');
import DrawList = require('../drawLists/DrawList');
import UniformProvider = require('../core/UniformProvider');

/**
 * @class WebGLRenderer
 * @extends RenderingContextUser
 */
interface WebGLRenderer extends RenderingContextUser {
  /**
   * @property autoClear
   * Defines whether the renderer should automatically clear its output before rendering.
   */
  autoClear: boolean;
  /**
   *
   */
  clearColor(red: number, green: number, blue: number, alpha: number): WebGLRenderer;
  /**
   * @method render
   * @param drawList {DrawList}
   * @param view {UniformProvider}
   */
  render(drawList: DrawList, view: UniformProvider): void;
}

export = WebGLRenderer;