import BrowserWindow from '../base/BrowserWindow'
import EngineApp from '../base/EngineApp'

/**
 * @class VisualApp
 * @extends EngineApp
 */
export default class VisualApp extends EngineApp {

  /**
   * @class VisualApp
   * @constructor
   * @param canvasId {string}
   * @param [wnd = window] {Window}
   */
  constructor(canvasId: string, wnd?: BrowserWindow) {
    super(canvasId, wnd)
    console.log('VisualApp.constructor')
  }

  /**
   * @method initialize
   * @return {void}
   * @protected
   */
  protected initialize(): void {
    super.initialize()
    console.log('VisualApp.initialize')
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    console.log('VisualApp.destructor')
    super.destructor()
  }
}
