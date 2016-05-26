import BrowserApp from './BrowserApp'
import BrowserWindow from './BrowserWindow'
import {Engine} from '../core/Engine'
import EngineAppOptions from './EngineAppOptions'
import getCanvasElementById from '../utils/getCanvasElementById'
import getDimensions from '../utils/getDimensions'
import isString from '../checks/isString'
import mustBeObject from '../checks/mustBeObject'
import mustBeNumber from '../checks/mustBeNumber'
import mustBeString from '../checks/mustBeString'
import {Scene} from '../core/Scene'

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
   * @param options {EngineAppOptions}
   */
  constructor(options: EngineAppOptions = {}) {
    super(options)
    this.engine = new Engine()
    this.canvasId = defaultCanvasId(options)
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
   * <p>
   * Sets the graphics buffers to values preselected by clearColor, clearDepth or clearStencil.
   * </p>
   * <p>
   * This method is a shortcut for <code>engine.clear()</code>.
   * </p>
   *
   * @method clear
   * @return {void}
   * @protected
   */
  protected clear(): void {
    this.engine.clear()
  }

  /**
   * @method initialize
   * @return {void}
   * @protected
   */
  protected initialize(): void {
    super.initialize()
    const dom: Document = this.window.document
    this.canvas = getCanvasElementById(this.canvasId, dom)
    if (this.canvas) {
      const dimensions = getDimensions(this.canvasId, dom)
      this.canvas.width = mustBeNumber('canvas.width', dimensions.width)
      this.canvas.height = mustBeNumber('canvas.height', dimensions.height)
      this.engine.start(this.canvas)
    }
    else {
      throw new Error(`${this.canvasId} must be the elementId of a canvas element.`)
    }
  }
}

function defaultCanvasId(options: EngineAppOptions): string {
  if (isString(options.canvasId)) {
    return options.canvasId
  }
  else {
    return 'canvas'
  }
}
