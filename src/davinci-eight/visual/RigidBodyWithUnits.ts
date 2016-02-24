import G3 from '../math/G3';
import IRigidBody from './IRigidBody'
import mustBeObject from '../checks/mustBeObject';
import Mesh from '../core/Mesh';
import Shareable from '../core/Shareable';
import Unit from '../math/Unit';
import VectorE3 from '../math/VectorE3';

const UNIT_MOMENTUM = Unit.KILOGRAM.mul(Unit.METER).div(Unit.SECOND)

/**
 * Convenient abstractions for Physics modeling.
 *
 * @module EIGHT
 * @submodule visual
 */

/**
 * A RigidBodyWithUnits is an Adapter for a Mesh.
 *
 * @class RigidBodyWithUnits
 * @extends Shareable
 */
export default class RigidBodyWithUnits extends Shareable implements IRigidBody<G3, G3> {

    /**
     * The underlying Mesh.
     *
     * @property mesh
     * @type Mesh
     * @private
     */
    private mesh: Mesh;
    private base: G3;

    /**
     * @property _mass
     * @type G3
     * @default one
     * @private
     */
    private _mass = G3.scalar(1, Unit.KILOGRAM)

    /**
     * @property _momentum
     * @type G3
     * @default 0 kg·m/s
     * @private
     */
    private _momentum = G3.scalar(0, Unit.KILOGRAM.mul(Unit.METER).div(Unit.SECOND))

    /**
     * Provides descriptive variables for translational and rotational motion.
     * This class is intended to be used as a base for bodies in the __visual__ module.
     *
     * @class RigidBodyWithUnits
     * @constructor
     * @param mesh {Mesh}
     * @param axis {VectorE3} The axis corresponding to a unit attitude spinor.
     * @param [type = 'RigidBodyWithUnits'] {string}
     */
    constructor(mesh: Mesh, axis: VectorE3, type = 'RigidBodyWithUnits') {
        super(type)
        this.mesh = mustBeObject('mesh', mesh);
        this.mesh.addRef()
        this.base = G3.direction(mustBeObject('axis', axis))
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.mesh.release()
        this.mesh = void 0
        super.destructor()
    }

    /**
     * @property axis
     * @type G3
     */
    public get axis(): G3 {
        return this.base.rotate(this.mesh.attitude)
    }
    public set axis(axis: G3) {
        mustBeObject('axis', axis)
        this.mesh.attitude.rotorFromDirections(this.base, axis)
    }

    /**
     * @property attitude
     * @type G3
     */
    get attitude(): G3 {
        return G3.fromSpinor(this.mesh.attitude)
    }
    set attitude(attitude: G3) {
        mustBeObject('attitude', attitude, () => { return this._type })
        Unit.compatible(attitude.uom, Unit.ONE)
        this.mesh.attitude.copySpinor(attitude)
    }

    /**
     * @property mass
     * @type G3
     */
    get mass(): G3 {
        return this._mass
    }
    set mass(mass: G3) {
        mustBeObject('mass', mass, () => { return this._type })
        Unit.compatible(mass.uom, Unit.KILOGRAM)
        this._mass = mass
    }

    /**
     * @property momentum
     * @type G3
     */
    get momentum(): G3 {
        return this._momentum
    }
    set momentum(momentum: G3) {
        mustBeObject('momentum', momentum, () => { return this._type })
        Unit.compatible(momentum.uom, UNIT_MOMENTUM)
        this._momentum = momentum
    }

    /**
     * @property position
     * @type G3
     */
    get position(): G3 {
        return G3.fromVector(this.mesh.position, Unit.METER)
    }
    set position(position: G3) {
        mustBeObject('position', position, () => { return this._type })
        Unit.compatible(position.uom, Unit.METER)
        this.mesh.position.copy(position)
    }
}
