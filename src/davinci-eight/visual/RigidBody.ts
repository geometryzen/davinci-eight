import ContextManager from '../core/ContextManager';
import { Geometric3 } from '../math/Geometric3';
import { Material } from '../core/Material';
import { PrincipalScaleGeometry } from './PrincipalScaleMesh';
import PrincipalScaleMesh from './PrincipalScaleMesh';
import mustBeObject from '../checks/mustBeObject';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

/**
 * Decorates the Mesh by adding properties for physical modeling.
 */
export class RigidBody extends PrincipalScaleMesh<PrincipalScaleGeometry, Material> {

    /**
     * <p>
     * Angular momentum (bivector)
     * </p>
     * <p>
     * The (dimensionless) angular momentum of the <code>RigidBody</code>.
     * <p>
     */
    public L = Geometric3.zero();

    /**
     * <p>
     * Mass (scalar)
     * <p>
     * <p>
     * The (dimensionless) mass of the <code>RigidBody</code>.
     * </p>
     */
    public m = 1;

    /**
     * <p>
     * Momentum (vector)
     * </p>
     * <p>
     * The (dimensionless) momentum of the <code>RigidBody</code>.
     * <p>
     */
    public P = Geometric3.zero();

    /**
     * <p>
     * Charge
     * </p>
     * <p>
     * The (dimensionless) charge of the <code>RigidBody</code>.
     * </p>
     */
    public Q = Geometric3.zero();

    /**
     * Cache the initial axis value so that we can compute the axis at any
     * time by rotating the initial axis using the Mesh attitude.
     */
    public initialAxis: VectorE3;

    constructor(contextManager: ContextManager, initialAxis: VectorE3, levelUp = 0) {
        super(mustBeObject('contextManager', contextManager), levelUp + 1);
        this.setLoggingName('RigidBody');
        this.initialAxis = Vector3.copy(initialAxis);
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    /**
     * Axis (vector)
     */
    get axis() {
        return Geometric3.fromVector(this.initialAxis).rotate(this.R);
    }
    set axis(axis: Geometric3) {
        mustBeObject('axis', axis);
        this.R.rotorFromDirections(this.initialAxis, axis);
    }
}
