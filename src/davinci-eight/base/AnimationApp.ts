import animation from '../utils/animation'
import EngineApp from './EngineApp'
import BrowserWindow from './BrowserWindow'
import Engine from '../core/Engine'
import mustBeString from '../checks/mustBeString'
import WindowAnimationOptions from '../utils/WindowAnimationOptions'
import WindowAnimationRunner from '../utils/WindowAnimationRunner'


/**
 * @class AnimationApp
 * @extends EngineApp
 */
export default class AnimationApp extends EngineApp {

  /**
   * @property animation
   * @type WindowAnimationRunner
   */
  private animation: WindowAnimationRunner

  /**
   * @class AnimationApp
   * @constructor
   * @param canvasId {string} The element id of the <code>HTMLCanvasElement</code>.
   * @param [wnd = window] {Window} The window in which the application will be running.
   */
  constructor(canvasId: string, wnd: BrowserWindow = window) {
    super(canvasId, wnd)
    const options: WindowAnimationOptions = {}
    options.window = this.window
    const animate = (time: number): void => {
      this.animate(time)
    }
    this.animation = animation(animate, options)
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    super.destructor()
  }

  /**
   * @method initialize
   * @return {void}
   * @protected
   */
  protected initialize(): void {
    super.initialize()
  }

  /**
   * @method animate
   * @param time {number}
   * @return {void}
   * @protected
   */
  protected animate(time: number): void {
    throw new Error("derived class must implement the protected animate(time: number): void method.")
  }

  /**
   * @method start
   * @return {void}
   * @protected
   */
  public start(): void {
    if (!this.animation.isRunning) {
      this.animation.start()
    }
  }

  /**
   * @method stop
   * @return {void}
   * @protected
   */
  public stop(): void {
    if (this.animation.isRunning) {
      this.animation.stop()
    }
  }

  /**
   * @method reset
   * @return {void}
   * @protected
   */
  public reset(): void {
    if (this.animation.isPaused) {
      this.animation.reset()
    }
  }
}
