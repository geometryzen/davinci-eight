import RenderingContextUser = require('../core/RenderingContextUser');
import World = require('../worlds/World');
import UniformProvider = require('../core/UniformProvider');

/**
 * @class WebGLRenderer
 * @extends RenderingContextUser
 */
interface WebGLRenderer extends RenderingContextUser {
  /**
   * @method render
   * @param world {World}
   * @param views {UniformProvider[]}
   */
  render(world: World, views: UniformProvider[]): void;
}

export = WebGLRenderer;