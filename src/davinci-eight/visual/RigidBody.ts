import Geometric3 from '../math/Geometric3'
import IRigidBody from './IRigidBody'
import Mesh from '../core/Mesh'
import mustBeObject from '../checks/mustBeObject'
import R3 from '../math/R3'
import Unit from '../math/Unit'
import VectorE3 from '../math/VectorE3'

/**
 * Decorates the Mesh by adding properties for physical modeling.
 *
 * @class RigidBody
 * @extends Mesh
 */
export default class RigidBody extends Mesh implements IRigidBody<number, Geometric3> {

  /**
   * The (dimensionless) mass of the <code>RigidBody</code>.
   *
   * @property mass
   * @type number
   * @default 1
   */
  public mass = 1

  /**
   * The (dimensionless) momentum of the <code>RigidBody</code>
   *
   * @property momentum
   * @type Geometric3
   * @default 0
   */
  public momentum = Geometric3.zero()

  /**
   * Cache the initial axis value so that we can compute the axis at any
   * time by rotating the initial axis using the Mesh attitude.
   *
   * @property initialAxis
   * @type R3
   */
  public initialAxis: R3

  /**
   * @class RigidBody
   * @constructor
   * @param type {string}
   * @param initialAxis {VectorE3} The initial direction of the symmetry axis
   */
  constructor(type: string, initialAxis: VectorE3) {
    super(type, void 0, void 0)
    this.initialAxis = R3.fromVector(initialAxis, Unit.ONE)
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
   * @property axis
   * @type Geometric3
   */
  get axis(): Geometric3 {
    return Geometric3.fromVector(this.initialAxis).rotate(this.attitude)
  }
  set axis(axis: Geometric3) {
    mustBeObject('axis', axis)
    this.attitude.rotorFromDirections(this.initialAxis, axis)
  }
}
