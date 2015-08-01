import RenderingContextUser = require('../core/RenderingContextUser');
import UniformProvider = require('../core/UniformProvider');
import DrawList = require('../drawLists/DrawList');

/**
 * @class Viewport
 */
interface Viewport extends RenderingContextUser {
  /**
   * @property canvas
   * @type HTMLCanvasElement
   */
  canvas: HTMLCanvasElement;
  /**
   * @property x
   * @type number
   */
  x: number;
  /**
   * @property y
   * @type number
   */
  y: number;
  /**
   * @property width
   * @type number
   */
  width: number;
  /**
   * @property height
   * @type number
   */
  height: number;
  /**
   * @method render
   * @param drawList {DrawList}
   * @param view {UniformProvider}
   */
  render(drawList: DrawList, view: UniformProvider): void;
  /**
   * @method clearColor
   * @param red {number}
   * @param green {number}
   * @param blue {number}
   * @param alpha {number}
   */
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  /**
   * @deprecated
   */
  setSize(width: number, height: number): void;
}

export = Viewport;
