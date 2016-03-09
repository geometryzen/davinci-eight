import Engine from '../core/Engine'
import Geometric3 from '../math/Geometric3'
import Geometry from '../core/Geometry'
import IRigidBody from './IRigidBody'
import Material from '../core/Material'
import Mesh from '../core/Mesh'
import mustBeObject from '../checks/mustBeObject'
import R3 from '../math/R3'
import Unit from '../math/Unit'
import VectorE3 from '../math/VectorE3'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * <p>
 * Decorates the Mesh by adding properties for physical modeling.
 * </p>
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
   * @param geometry {Geometry}
   * @param material {Material}
   * @param engine {Engine}
   * @param initialAxis {VectorE3} The initial direction of the symmetry axis
   */
  constructor(geometry: Geometry, material: Material, engine: Engine, initialAxis: VectorE3) {
    super(geometry, material, engine)
    this.setLoggingName('RigidBody')
    this.initialAxis = R3.fromVector(initialAxis, Unit.ONE)
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    if (levelUp === 0) {
      this.cleanUp()
    }
    super.destructor(levelUp + 1)
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
