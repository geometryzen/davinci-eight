import BrowserAppOptions from './BrowserAppOptions'

/**
 * @class EngineAppOptions
 * @extends BrowserAppOptions
 */
interface EngineAppOptions extends BrowserAppOptions {
  /**
   * <p>
   * The element id of the <code>HTMLCanvasElement</code>.
   * </p>
   *
   * @attribute canvasId
   * @type string
   * @optional
   * @default 'canvas'
   */
  canvasId?: string;
}

export default EngineAppOptions;
