import AnimationApp from '../base/AnimationApp'
import BrowserWindow from '../base/BrowserWindow'
import Scene from '../core/Scene'
import Viewport from './Viewport'

/**
 * @class SingleViewApp
 * @extends AnimationApp
 */
export default class SingleViewApp extends AnimationApp {

  /**
   * @property view
   * @type Viewport
   * @protected
   */
  protected view = new Viewport(this.engine)

  /**
   * @class SingleViewApp
   * @constructor
   * @param canvasId {string} The element id of the <code>HTMLCanvasElement</code>.
   * @param [wnd = window] {Window} The window in which the application will be running.
   */
  constructor(canvasId: string, wnd: BrowserWindow = window) {
    super(canvasId, wnd)
  }

  /**
   * @method initialize
   * @return {void}
   * @protected
   */
  protected initialize(): void {
    super.initialize()

    const view = this.view
    view.setPortal(0, 0, this.canvas.width, this.canvas.height)
    const scene = new Scene(this.engine)
    try {
      view.scene = scene
    }
    finally {
      scene.release()
    }
  }

  /**
   * @method draw
   * @return {void}
   * @protected
   */
  protected draw(): void {
    this.view.draw()
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    this.view.release()
    super.destructor()
  }
}
