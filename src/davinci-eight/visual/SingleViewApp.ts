import AnimationApp from '../base/AnimationApp'
import Scene from '../core/Scene'
import SingleViewAppOptions from './SingleViewAppOptions'
import Viewport from './Viewport'

/**
 * <p>
 * An <code>AnimationApp</code> with a single <code>Viewport</code>.
 * </p>
 *
 * @example
 *     class MyApp extends EIGHT.SingleViewApp {
 *       private sphere = new EIGHT.Sphere()
 *       constructor(canvasId: string) {
 *         super(canvasId, window)
 *       }
 *       protected initialize(): void {
 *         super.initialize()
 *         const scene = this.view.scene
 *         scene.add(this.sphere)
 *         scene.release()
 *         this.start()
 *       }
 *       //
 *       //
 *       //
 *       protected animate(time: number): void {
 *         // 
 *         this.clear()
 *         // Move your objects around.
 *
 *         // 
 *         this.draw()
 *       }
 *       //
 *       // The destructor will be called when the window is unloading.
 *       // It is your opportunity to release any resources.
 *       //
 *       protected destructor(): void {
 *         this.sphere.release()
 *         // Call up the destructor chain as the last call.
 *         super.destructor()
 *       }
 *     }
 *     // Creating the application starts it listening for DOMContentLoaded events.
 *     new MyApp('canvas')
 *
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
   * @param options {SingleViewAppOptions}
   */
  constructor(options: SingleViewAppOptions) {
    super(options)
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
