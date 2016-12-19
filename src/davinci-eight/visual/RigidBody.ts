import ContextManager from '../core/ContextManager';
import Geometric3 from '../math/Geometric3';
import Geometry from '../core/Geometry';
import Material from '../core/Material';
import Mesh from '../core/Mesh';
import { R3 } from '../math/R3';

/**
 * Decorates the Mesh by adding properties for physical modeling.
 */
export class RigidBody extends Mesh<Geometry, Material> {

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
     * 
     */
    constructor(contextManager: ContextManager, initialAxis: R3, initialMeridian: R3, levelUp = 0) {
        super(void 0, void 0, contextManager, { axis: initialAxis, meridian: initialMeridian }, levelUp + 1);
        this.setLoggingName('RigidBody');
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}

export default RigidBody;
