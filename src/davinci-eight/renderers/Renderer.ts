import RenderingContextUser = require('../core/RenderingContextUser');
import DrawList = require('../drawLists/DrawList');
import UniformProvider = require('../core/UniformProvider');

/**
 * @class Renderer
 * @extends RenderingContextUser
 */
interface Renderer extends RenderingContextUser {
  /**
   * @method render
   * @param drawList {DrawList}
   * @param views {UniformProvider[]}
   */
  render(drawList: DrawList, views: UniformProvider[]): void;
}

export = Renderer;