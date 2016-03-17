import BrowserWindow from '../base/BrowserWindow'
import MouseControls from './MouseControls'
import Vector3 from '../math/Vector3'
import View from '../facets/View'
import ViewController from './ViewController'

/**
 * @class ViewControls
 * @extends MouseControls
 */
export default class ViewControls extends MouseControls implements ViewController {

  /**
   * @property rotateSpeed
   * @type number
   * @default 1
   */
  public rotateSpeed = 1

  /**
   * @property zoomSpeed
   * @type number
   * @default 1
   */
  public zoomSpeed = 1

  /**
   * @property panSpeed
   * @type number
   * @default 1
   */
  public panSpeed = 1

  /**
   * The view.eye value when the view was acquired by this view controller.
   *
   * @property eye0
   * @type Vector3
   * @private
   */
  private eye0 = Vector3.vector(0, 0, 1);

  /**
   * The view.look value when the view was acquired by this view controller.
   *
   * @property look0
   * @type Vector3
   * @private
   */
  private look0 = Vector3.zero();

  /**
   * The view.up value when the view was acquired by this view controller.
   *
   * @property up0
   * @type Vector3
   * @private
   */
  private up0 = Vector3.vector(0, 1, 0);

  /**
   * The view that is being controlled.
   *
   * @property view
   * @type View
   * @private
   */
  private view: View;

  /**
   * @property eyeMinusLook
   * @type Vector3
   * @protected
   */
  protected eyeMinusLook = new Vector3()

  /**
   * @property look
   * @type Vector3
   * @protected
   */
  protected look = new Vector3()

  /**
   * @property up
   * @type Vector3
   * @protected
   */
  protected up = new Vector3()

  /**
   * @class ViewControls
   * @constructor
   * @param view {View}
   * @param wnd {Window}
   */
  constructor(view: View, wnd: BrowserWindow) {
    super(wnd)
    this.setLoggingName('ViewControls')
    this.setView(view)
  }

  /**
   * @method destructor
   * @param levelUp {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1)
  }

  /**
   * @method hasView
   * @return {boolean}
   * @protected
   */
  protected hasView(): boolean {
    return !!this.view
  }

  /**
   * This should be called inside the animation frame to update the camera location.
   * Notice that the movement of the mouse controls is decoupled from the effect.
   * We also want to avoid temporary object creation in this and called methods by recycling variables.
   *
   * @method update
   * @return {void}
   */
  public update(): void {
    if (this.view) {
      this.eyeMinusLook.copy(this.view.eye).sub(this.view.look)
      this.look.copy(this.view.look)
      this.up.copy(this.view.up)

      if (!this.noRotate) {
        this.rotateCamera()
      }
      if (!this.noZoom) {
        this.zoomCamera()
      }
      if (!this.noPan) {
        this.panCamera()
      }

      this.view.eye.copyVector(this.look).addVector(this.eyeMinusLook)
      this.view.look.copyVector(this.look)
      this.view.up.copyVector(this.up)
    }
  }

  /**
   * @method rotateCamera
   * @return {void}
   * @protected
   */
  protected rotateCamera(): void {
    // Do nothing.
  }

  /**
   * @method zoomCamera
   * @return {void}
   * @protected
   */
  protected zoomCamera(): void {
    const factor = 1 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed
    if (factor !== 1 && factor > 0) {
      this.eyeMinusLook.scale(factor)
      this.zoomStart.copy(this.zoomEnd)
    }
  }

  /**
   * @method panCamera
   * @return {void}
   * @protected
   */
  protected panCamera(): void {
    // Do nothing
  }

  /**
   * @method reset
   * @return {void}
   */
  public reset(): void {
    if (this.view) {
      this.view.eye.copyVector(this.eye0)
      this.view.look.copyVector(this.look0)
      this.view.up.copyVector(this.up0)
    }
    super.reset()
  }

  /**
   * @method setView
   * @param view {View}
   * @return {void}
   */
  public setView(view: View): void {
    if (view) {
      this.view = view
    }
    else {
      this.view = void 0
    }
    this.synchronize()
  }

  /**
   * @method synchronize
   * @return {void}
   */
  public synchronize(): void {
    const view = this.view
    if (view) {
      this.eye0.copy(view.eye)
      this.look0.copy(view.look)
      this.up0.copy(view.up)
    }
    else {
      this.eye0.setXYZ(0, 0, 1)
      this.look0.zero()
      this.up0.setXYZ(0, 1, 0)
    }
  }
}
