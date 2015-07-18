import RenderingContextUser = require('../core/RenderingContextUser');
import VertexUniformProvider = require('../core/VertexUniformProvider');

/**
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGLRenderingContext.
 * @class Drawable
 * @extends RenderingContextUser
 */
interface Drawable extends RenderingContextUser {
  /**
   * @property drawGroupName
   * @type string
   */
  drawGroupName: string;
  /**
   * @method useProgram
   */
  useProgram();
  /**
   * @method draw
   * @param view {VertexUniformProvider}
   */
  draw(view: VertexUniformProvider);
}

export = Drawable;
