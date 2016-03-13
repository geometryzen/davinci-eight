import AnimationApp from '../base/AnimationApp'
import BrowserWindow from '../base/BrowserWindow'
import mustBeGE from '../checks/mustBeGE'
import mustBeInteger from '../checks/mustBeInteger'
import Scene from '../core/Scene'
import ShareableArray from '../collections/ShareableArray'
import Viewport from './Viewport'

/**
 * @class MultiViewApp
 * @extends AnimationApp
 */
export default class MultiViewApp extends AnimationApp {

  /**
   * @property views
   * @type ShareableArray<Viewport>
   * @protected
   */
  protected views = new ShareableArray<Viewport>()

  /**
   * @class MultiViewApp
   * @constructor
   * @param numViews {number} The initial number of views. Views may be added and removed later.
   * @param canvasId {string} The element id of the <code>HTMLCanvasElement</code>.
   * @param [wnd = window] {Window} The window in which the application will be running.
   */
  constructor(numViews: number, canvasId: string, wnd: BrowserWindow = window) {
    super(canvasId, wnd)
    mustBeInteger('numViews', numViews)
    mustBeGE('numViews', numViews, 0)
    for (let i = 0; i < numViews; i++) {
      this.views.pushWeakRef(new Viewport(this.engine))
    }
  }

  /**
   * @method initialize
   * @return {void}
   * @protected
   */
  protected initialize(): void {
    super.initialize()

    const w = this.canvas.width
    const h = this.canvas.height

    const scene = new Scene(this.engine)
    const views = this.views
    const iLen = views.length
    for (let i = 0; i < iLen; i++) {
      const view = views.getWeakRef(i)
      view.scene = scene
      view.setPortal(0, 0, w, h)
    }
    scene.release()
  }

  /**
   * @method draw
   * @return {void}
   * @protected
   */
  protected draw(): void {
    const views = this.views
    const iLen = views.length
    for (let i = 0; i < iLen; i++) {
      const view = views.getWeakRef(i)
      view.draw()
    }
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    this.views.release()
    super.destructor()
  }
}
