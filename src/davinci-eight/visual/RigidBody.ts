import {Engine} from '../core/Engine'
import {Geometric3} from '../math/Geometric3'
import {Geometry} from '../core/Geometry'
import IRigidBody from './IRigidBody'
import {Material} from '../core/Material'
import {Mesh} from '../core/Mesh'
import mustBeObject from '../checks/mustBeObject'
import R3 from '../math/R3'
import {Unit} from '../math/Unit'
import VectorE3 from '../math/VectorE3'

/**
 * <p>
 * Decorates the Mesh by adding properties for physical modeling.
 * </p>
 */
export class RigidBody extends Mesh implements IRigidBody<number, Geometric3, Geometric3> {

  /**
   * <p>
   * Angular momentum (bivector)
   * </p>
   * <p>
   * The (dimensionless) angular momentum of the <code>RigidBody</code>.
   * <p>
   *
   * @default 0
   */
  public L = Geometric3.zero()

  /**
   * <p>
   * Mass (scalar)
   * <p>
   * <p>
   * The (dimensionless) mass of the <code>RigidBody</code>.
   * </p>
   *
   * @default 1
   */
  public m = 1

  /**
   * <p>
   * Momentum (vector)
   * </p>
   * <p>
   * The (dimensionless) momentum of the <code>RigidBody</code>.
   * <p>
   *
   * @default 0
   */
  public P = Geometric3.zero()

  /**
   * <p>
   * Charge
   * </p>
   * <p>
   * The (dimensionless) charge of the <code>RigidBody</code>.
   * </p>
   *
   * @default 0
   */
  public Q = Geometric3.zero()

  /**
   * Cache the initial axis value so that we can compute the axis at any
   * time by rotating the initial axis using the Mesh attitude.
   */
  public initialAxis: R3

  /**
   * @param geometry
   * @param material
   * @param engine
   * @param initialAxis The initial direction of the symmetry axis
   */
  constructor(geometry: Geometry, material: Material, engine: Engine, initialAxis: VectorE3) {
    super(geometry, material, engine)
    this.setLoggingName('RigidBody')
    this.initialAxis = R3.fromVector(initialAxis, Unit.ONE)
  }

  /**
   * @param levelUp
   */
  protected destructor(levelUp: number): void {
    if (levelUp === 0) {
      this.cleanUp()
    }
    super.destructor(levelUp + 1)
  }

  /**
   * <p>
   * Axis (vector)
   * </p>
   */
  get axis() {
    // This is a copy!
    return Geometric3.fromVector(this.initialAxis).rotate(this.R)
  }
  set axis(axis: Geometric3) {
    mustBeObject('axis', axis)
    this.R.rotorFromDirections(this.initialAxis, axis)
  }
}
