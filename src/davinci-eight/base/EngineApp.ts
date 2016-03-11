import BrowserApp from './BrowserApp'
import BrowserWindow from './BrowserWindow'
import Engine from '../core/Engine'
import mustBeString from '../checks/mustBeString'

/**
 * @class EngineApp
 * @extends BrowserApp
 */
export default class EngineApp extends BrowserApp {
  /**
   * The <code>engine</code> is immediately available to derived classes.
   *
   * @property engine
   * @type Engine
   * @protected
   */
  protected engine: Engine

  /**
   * The <code>canvas</code> is only available after the <code>initialize</code> method.
   *
   * @property canvas
   * @type HTMLCanvasElement
   * @protected
   */
  protected canvas: HTMLCanvasElement;

  /**
   * @property canvasId
   * @type string
   * @private
   */
  private canvasId: string

  /**
   * @class EngineApp
   * @constructor
   * @param canvasId {string}
   * @param [wnd = window] {Window}
   */
  constructor(canvasId: string, wnd?: BrowserWindow) {
    super(wnd)
    this.engine = new Engine()
    this.canvasId = mustBeString('canvasId', canvasId)
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    if (this.engine) {
      this.engine.stop()
      this.engine.release()
      this.engine = void 0
    }
    super.destructor()
  }

  /**
   * @method initialize
   * @return {void}
   * @protected
   */
  protected initialize(): void {
    super.initialize()
    this.canvas = <HTMLCanvasElement>this.window.document.getElementById(this.canvasId)
    if (this.canvas) {
      this.engine.start(this.canvas)
    }
    else {
      throw new Error(`${this.canvasId} must be the elementId of a canvas element.`)
    }
  }
}
