import BrowserWindow from '../base/BrowserWindow'
import Controller from './Controller'
import Geometric3 from '../math/Geometric3'
import MouseControls from './MouseControls'
import mustBeObject from '../checks/mustBeObject'
import PerspectiveCamera from '../facets/PerspectiveCamera'
import Vector2 from '../math/Vector2'
import Vector3 from '../math/Vector3'

/**
 * @module EIGHT
 * @submodule controls
 */

/**
 * <p>
 * Allows a camera to be manipulated using mouse controls.
 * </p>
 *
 * @example
 *     const camera = new EIGHT.PerspectiveCamera()
 *
 *     // Create TrackballControls anytime.
 *     const controls = new EIGHT.TrackballControls(camera)
 *
 *     // Subscribe to mouse events, usually in the window.onload function.
 *     controls.subscribe(canvas)
 *
 *     // Update the camera position, usually in the animate function.
 *     controls.update()
 *
 *     // Stop listening to mouse events.
 *     controls.unsubscribe()
 *
 *     // Inform the controls they are no longer needed, usually in the window.onunload function.
 *     controls.release()
 *
 * You may decide to update directional lighting to synchronize with the camera.
 *
 * @class TrackballControls
 * @extends MouseControls
 */
export default class TrackballControls extends MouseControls implements Controller {

  /**
   * @property rotateSpeed
   * @type number
   * @default 6
   */
  public rotateSpeed = 6

  /**
   * @property zoomSpeed
   * @type number
   * @default 4
   */
  public zoomSpeed = 4

  /**
   * @property panSpeed
   * @type number
   * @default 1
   */
  public panSpeed = 1

  /**
   * The camera object is what we will be moving.
   */
  private camera: PerspectiveCamera

  /**
   * The eye vector is the position of the camera relative to the target position vector.
   * So, camera.position = target + eye, or, eye = camera.position - target.
   */
  private eye = new Vector3()

  /**
   * The position that we look at.
   */
  private look = new Geometric3()

  /**
   * The initial position, look and up of the camera.
   * We cache these so that we can reset the camera.
   */
  private position0: Vector3
  private target0: Geometric3
  private up0: Vector3

  // Working storage for calculations that update the camera.
  private moveDirection = new Vector3()
  private eyeDirection = new Vector3()
  private objectUpDirection = new Vector3()
  private objectSidewaysDirection = new Vector3()
  private axis = new Vector3()
  private rotor = new Geometric3()
  private mouseChange = new Vector2()
  private pan = new Vector3()
  private objectUp = new Vector3()

  /**
   * @class TrackballControls
   * @constructor
   * @param camera {PerspectiveCamera}
   * @param [wnd = window] {Window}
   */
  constructor(camera: PerspectiveCamera, wnd: BrowserWindow = window) {
    super(wnd)
    this.setLoggingName('TrackballControls')
    mustBeObject('camera', camera)
    this.camera = camera

    // Cache camera properties required for a reset.
    // TODO: Why don't we cache the look vector?
    // TODO: I think there is an assumption that the look is the origin.
    this.target0 = this.look.clone() // ???
    this.position0 = this.camera.position.clone()
    this.up0 = this.camera.up.clone()

    this.update()
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
   * @method reset
   * @return {void}
   */
  public reset(): void {
    this.look.copy(this.target0)
    this.camera.position.copy(this.position0)
    this.camera.up.copy(this.up0)

    this.eye.copy(this.camera.position).sub(this.look)
    this.camera.look.copy(this.look)
    super.reset()
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

    this.eye.copy(this.camera.position).sub(this.look)

    if (!this.noRotate) {
      this.rotateCamera()
    }
    if (!this.noZoom) {
      this.zoomCamera()
    }
    if (!this.noPan) {
      this.panCamera()
    }
    this.camera.position.copy(this.look).add(this.eye)
    this.checkDistances()
    this.camera.look.copy(this.look)
    // If the distance from the last position to the camera position is significant,
    // Emit a change event and update the last position with the current camera position.
  }

  /**
   * @method rotateCamera
   * @return {void}
   * @private
   */
  private rotateCamera(): void {
    // Temporarily use the moveDirection to calculate an angle.
    this.moveDirection.setXYZ(this.moveCurr.x - this.movePrev.x, this.moveCurr.y - this.movePrev.y, 0)
    // This is a quick and dirty approximation of the angle of the rotation.
    // Since the coordinates of the mouse run from -1 to +1 in both directions,
    // The largest mouse movement is 2 * sqrt(2).
    // And so the corresponding angle in degrees is approximately 2 * 81 degrees = 162 degrees.
    // Update: Actually, this is a nice model of moving a plane over a unit sphere.
    // The rotation angle is then exactly equal to the magnitide of the displacement
    // if the radius of the sphere is unity.
    let angle = this.moveDirection.magnitude()
    if (angle) {

      this.eye.copy(this.camera.position).sub(this.look)

      this.eyeDirection.copy(this.eye).normalize()
      // Compute the unit vector pointing in the camera up direction.
      // We assume (and maintain) that the up direction is aligned with e2 in the mouse coordinate frame.
      this.objectUpDirection.copy(this.camera.up).normalize()
      // Compute the unit vector pointing to the viewers right.
      this.objectSidewaysDirection.copy(this.objectUpDirection).cross(this.eyeDirection)
      // Scale these unit vectors (ahem) according to the mouse movements.
      this.objectUpDirection.scale(this.moveCurr.y - this.movePrev.y)
      this.objectSidewaysDirection.scale(this.moveCurr.x - this.movePrev.x)
      // Compute the move direction from the components.
      this.moveDirection.copy(this.objectUpDirection).add(this.objectSidewaysDirection).normalize()
      // Compute the axis of rotation. This computation appears to be off by a sign (-1),
      // but that's because the camera will move while the scene stays still.
      this.axis.copy(this.moveDirection).cross(this.eyeDirection)
      // We tweak the angle.
      angle *= this.rotateSpeed;
      // Compute the rotor for rotating the eye vector.
      this.rotor.rotorFromAxisAngle(this.axis, angle)
      // Move the viewing point relative to the target.
      this.eye.rotate(this.rotor)
      // Here's where we maintain the camera's up vector in the viewing plane.
      // It seems inconsistent that we affect the camera.up vector, but not the camera.position.
      // That's probably because we are going to combine pan and zoom.
      this.camera.up.rotate(this.rotor)
    }

    this.movePrev.copy(this.moveCurr)
  }

  /**
   * @method zoomCamera
   * @return {void}
   * @private
   */
  private zoomCamera(): void {
    const factor = 1 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed
    if (factor !== 1 && factor > 0) {
      this.eye.scale(factor)
      this.zoomStart.copy(this.zoomEnd)
    }
  }

  /**
   * @method panCamera
   * @return {void}
   * @private
   */
  private panCamera(): void {
    this.mouseChange.copy(this.panEnd).sub(this.panStart)
    if (this.mouseChange.squaredNorm()) {
      this.mouseChange.scale(this.eye.magnitude() * this.panSpeed)
      this.pan.copy(this.eye).cross(this.camera.up).normalize().scale(this.mouseChange.x)
      this.objectUp.copy(this.camera.up).normalize().scale(this.mouseChange.y)
      this.pan.add(this.objectUp)
      this.camera.position.add(this.pan)
      this.look.addVector(this.pan)
      this.panStart.copy(this.panEnd)
    }
  }

  /**
   * Restricts the position of the camera to certain distance range
   */
  private checkDistances() {
    // TODO
  }
}
