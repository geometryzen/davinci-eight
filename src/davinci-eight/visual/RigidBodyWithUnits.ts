import {G3} from '../math/G3';
import incLevel from '../base/incLevel';
import IRigidBody from './IRigidBody'
import mustBeObject from '../checks/mustBeObject';
import {Mesh} from '../core/Mesh';
import {ShareableBase} from '../core/ShareableBase';
import {Unit} from '../math/Unit';
import VectorE3 from '../math/VectorE3';

const UNIT_P = Unit.KILOGRAM.mul(Unit.METER).div(Unit.SECOND)
const UNIT_L = UNIT_P.mul(Unit.METER)

/**
 * Physics modeling.
 *
 * @module EIGHT
 * @submodule visual
 */

/**
 * A RigidBodyWithUnits is an Adapter for a Mesh.
 *
 * @class RigidBodyWithUnits
 * @extends ShareableBase
 */
export default class RigidBodyWithUnits extends ShareableBase implements IRigidBody<G3, G3, G3> {

  /**
   * The underlying Mesh.
   *
   * @property mesh
   * @type Mesh
   * @private
   */
  private mesh: Mesh;

  /**
   * The initial axis (corresponds to attitude = 1).
   */
  private base: G3;

  /**
   * @property _mass
   * @type G3
   * @default one
   * @private
   */
  private _mass = G3.scalar(1, Unit.KILOGRAM)

  /**
   * @property _P
   * @type G3
   * @default 0 kg·m/s
   * @private
   */
  private _P = G3.scalar(0, UNIT_P)


  /**
   * @property _L
   * @type G3
   * @default 0 kg·m ** 2/s
   * @private
   */
  private _L = G3.scalar(0, UNIT_L)

  /**
   * @property _charge
   * @type G3
   * @default 0 C
   * @private
   */
  private _charge = G3.scalar(0, Unit.COULOMB)

  /**
   * Provides descriptive variables for translational and rotational motion.
   * This class is intended to be used as a base for bodies in the __visual__ module.
   *
   * @class RigidBodyWithUnits
   * @constructor
   * @param mesh {Mesh}
   * @param axis {VectorE3} The axis corresponding to a unit attitude spinor.
   */
  constructor(mesh: Mesh, axis: VectorE3) {
    super()
    this.setLoggingName('RigidBodyWithUnits')
    this.mesh = mustBeObject('mesh', mesh);
    this.mesh.addRef()
    this.base = G3.direction(mustBeObject('axis', axis))
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    this.mesh.release()
    this.mesh = void 0
    super.destructor(incLevel(level))
  }

  /**
   * <p>
   * Axis (vector)
   * </p>
   *
   * @property axis
   * @type G3
   */
  public get axis(): G3 {
    return this.base.rotate(this.mesh.R)
  }
  public set axis(axis: G3) {
    mustBeObject('axis', axis)
    this.mesh.R.rotorFromDirections(this.base, axis)
  }

  /**
   * <p>
   * <em>Attitude</em> (spinor)
   * </p>
   *
   * @property R
   * @type G3
   */
  get R(): G3 {
    return G3.fromSpinor(this.mesh.R)
  }
  set R(R: G3) {
    mustBeObject('R', R, () => { return this._type })
    Unit.compatible(R.uom, Unit.ONE)
    this.mesh.R.copySpinor(R)
  }

  /**
   * <p>
   * Angular momentum (bivector)
   * </p>
   *
   * @property L
   * @type G3
   */
  get L(): G3 {
    return this._L
  }
  set L(L: G3) {
    mustBeObject('L', L, () => { return this._type })
    Unit.compatible(L.uom, UNIT_L)
    this._L = L
  }

  /**
   * <p>
   * Mass (scalar)
   * </p>
   *
   * @property m
   * @type G3
   */
  get m(): G3 {
    return this._mass
  }
  set m(m: G3) {
    mustBeObject('m', m, () => { return this._type })
    Unit.compatible(m.uom, Unit.KILOGRAM)
    this._mass = m
  }

  /**
   * <p>
   * Momentum (vector)
   * </p>
   *
   * @property P
   * @type G3
   */
  get P(): G3 {
    return this._P
  }
  set P(P: G3) {
    mustBeObject('P', P, () => { return this._type })
    Unit.compatible(P.uom, UNIT_P)
    this._P = P
  }

  /**
   * <p>
   * Charge
   * </p>
   *
   * @property Q
   * @type G3
   */
  get Q(): G3 {
    return this._charge
  }
  set Q(Q: G3) {
    mustBeObject('Q', Q, () => { return this._type })
    Unit.compatible(Q.uom, Unit.COULOMB)
    this._charge = Q
  }

  /**
   * <p>
   * Position (vector)
   * </p>
   *
   * @property X
   * @type G3
   */
  get X(): G3 {
    return G3.fromVector(this.mesh.X, Unit.METER)
  }
  set X(X: G3) {
    mustBeObject('X', X, () => { return this._type })
    Unit.compatible(X.uom, Unit.METER)
    this.mesh.X.copy(X)
  }
}
