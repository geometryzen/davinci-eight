import BrowserWindow from '../base/BrowserWindow'
import Controller from './Controller'
import ControlsTarget from './ControlsTarget'
import MouseControls from './MouseControls'
import Geometric3 from '../math/Geometric3'
import Vector3 from '../math/Vector3'
import Spinor3 from '../math/Spinor3'
// import R3 from '../math/R3'

// Scratch variables to aboid creating temporary objects.
const a: Geometric3 = Geometric3.zero()
const b: Geometric3 = Geometric3.zero()
const d: Geometric3 = Geometric3.zero()
const B: Geometric3 = Geometric3.one()
const R: Geometric3 = Geometric3.one()
const X: Geometric3 = Geometric3.zero()

/**
 * <p>
 * <code>OrbitControls</code> move a camera over a sphere such that the camera up vector
 * remains aligned with the local north vector.
 * </p>
 * <p>
 * For rotations, the final camera position dictates a new camera local reference frame.
 * A rotor may be calculated that rotates the camera from its old reference frame to the
 * new reference frame. This rotor may also be interpolated for animations.
 * </p>
 *
 * @class OrbitControls
 * @extends MouseControls
 */
export default class OrbitControls extends MouseControls implements Controller {

  /**
   * The initial position of the target.
   */
  private position0 = Vector3.zero()

  /**
   * The initial attitude of the target.
   */
  private attitude0 = Spinor3.one()

  /**
   * The object that is being controlled.
   */
  private target: ControlsTarget;

  /**
   * @class OrbitControls
   * @constructor
   * @param [wnd = window] {Window}
   */
  constructor(wnd: BrowserWindow) {
    super(wnd)
    this.setLoggingName('OrbitControls')
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
   * @method update
   * @return {void}
   */
  public update(): void {
    // Think of the mouse movement as moving a plane over a sphere that is free to
    // rotate at its origin. This model ensures that the rotation of the sphere is
    // proportional to the distance moved by the mouse.
    // For a unit sphere, the rotation angle ψ is exactly equal to the magnitude of the displacement.
    // When moving a camera is suffices to change the position because the camera
    // will maintain its 'look' point and 'up' vector and adjust its attitude accordingly.
    // TODO: We could check for equality first, rather than compute distance.
    if (this.target) {
      const ψ = this.moveCurr.distanceTo(this.movePrev)
      if (ψ > 0) {
        // We'll need the attitude of the camera in order to convert our mouse motion and
        // vector from the origin to the screen. Reverse the target attitude to get the
        // rotor that we must apply to get the true rotation.
        X.copyVector(this.target.getPosition())
        R.copySpinor(this.target.getAttitude())
        a.zero()
        a.x = this.movePrev.x
        a.y = this.movePrev.y
        a.z = 1
        b.zero()
        b.x = this.moveCurr.x
        b.y = this.moveCurr.y
        b.z = 1
        d.copy(b).sub(a)
        // We're rotating d and e3 here. Equally, we could rotate the bivector B.
        d.rotate(R)
        X.normalize() // or we could have rotated the e3 vector.
        // B = direction(X ^ d)
        B.copyVector(X).ext(d).normalize()
        // R is the rotor that moves the camera from its previous position.
        // Notice the plus sign, because the camera moves in the opposite orientation.
        R.copy(B).scale(+ψ / 2).exp()
        if (this.target) {
          X.copyVector(this.target.getPosition())
          X.rotate(R)
          this.target.setPosition(X)
        }
      }
    }
    this.movePrev.copy(this.moveCurr)
  }

  /**
   * @method reset
   * @return {void}
   */
  public reset(): void {
    if (this.target) {
      this.target.setPosition(this.position0)
      // this.target.setAttitude(this.attitude0)
      this.attitude0.addScalar(0) // whatever
    }
  }

  /**
   * @method setTarget
   * @param target {ControlsTarget}
   * @return {void}
   */
  public setTarget(target: ControlsTarget): void {
    if (target) {
      // const position = target.getPosition()
      this.position0.copy(target.getPosition())
      // const attitude = target.getAttitude()
      // this.attitude0.copy(target.getAttitude())
      this.target = target
    }
    else {
      this.target = void 0
    }
  }
}
