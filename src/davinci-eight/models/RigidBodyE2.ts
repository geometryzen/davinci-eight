import ModelE2 = require('../models/ModelE2')
import G2 = require('../math/G2')

/**
 * @class RigidBodyE2
 * @extends ModelE2
 */
class RigidBodyE2 extends ModelE2 {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {G2}
     */
    public V: G2 = new G2().zero();
    /**
     * <p>
     * The <em>rotational velocity</em>, a spinor.
     * </p>
     * @property Ω
     * @type {G2}
     */
    public Ω: G2 = new G2().zero().addScalar(1);
    /**
     * <p>
     * Constructs a RigidBodyE2.
     * </p>
     * @class RigidBodyE2
     * @constructor
     * @param [type = 'RigidBodyE2'] {string} The name used for reference counting.
     */
    constructor(type: string = 'RigidBodyE2') {
        super(type)
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }
}
export = RigidBodyE2