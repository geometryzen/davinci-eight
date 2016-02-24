import Geometric3 from '../math/Geometric3'
import Geometry from '../core/Geometry'
import IRigidBody from './IRigidBody'
import Material from '../core/Material'
import Mesh from '../core/Mesh'
import mustBeObject from '../checks/mustBeObject';
import R3 from '../math/R3';
import SpinorE3 from '../math/SpinorE3'
import Unit from '../math/Unit';
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
     * @property _direction
     * @type R3
     * @private
     */
    private _direction: R3;

    /**
     * @class RigidBody
     * @constructor
     * @param geometry {Geometry}
     * @param material {Material}
     * @param type {string}
     * @param deviation {SpinorE3} The deviation from the scaling reference frame.
     * @param direction {VectorE3} The initial direction of the symmetry axis
     */
    constructor(geometry: Geometry, material: Material, type: string, deviation: SpinorE3, direction: VectorE3) {
        super(geometry, material, type)
        this._direction = R3.fromVector(direction, Unit.ONE)
        this.deviation.copy(deviation)
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
     * @type R3
     */
    get axis(): R3 {
        return this._direction.rotate(this.attitude)
    }
    set axis(axis: R3) {
        mustBeObject('axis', axis)
        this.attitude.rotorFromDirections(this._direction, axis)
    }
}
