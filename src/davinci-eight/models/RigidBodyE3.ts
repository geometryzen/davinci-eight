import ModelE3 = require('../models/ModelE3')
import G3 = require('../math/G3')

/**
 * @class RigidBodyE3
 * @extends ModelE3
 */
class RigidBodyE3 extends ModelE3 {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {G3}
     */
    public V: G3 = new G3().zero();
    /**
     * <p>
     * The <em>rotational velocity</em>, a spinor.
     * </p>
     * @property Ω
     * @type {G3}
     */
    public Ω: G3 = new G3().zero().addScalar(1);
    /**
     * <p>
     * Constructs a RigidBodyE3.
     * </p>
     * @class RigidBodyE3
     * @constructor
     * @param [type = 'RigidBodyE3'] {string} The name used for reference counting.
     */
    constructor(type: string = 'RigidBodyE3') {
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
export = RigidBodyE3