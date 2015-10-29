import Euclidean3 = require('../math/Euclidean3')
import ModelFacetE3 = require('../models/ModelFacetE3')
import G3 = require('../math/G3')

/**
 * @class KinematicRigidBodyFacetE3
 * @extends ModelFacetE3
 */
class KinematicRigidBodyFacetE3 extends ModelFacetE3 {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {G3}
     */
    public V: G3 = new G3().copy(Euclidean3.zero);
    /**
     * <p>
     * The <em>rotational velocity</em>, a spinor.
     * </p>
     * @property Ω
     * @type {G3}
     */
    public Ω: G3 = new G3();
    /**
     * <p>
     * Constructs a KinematicRigidBodyFacetE3.
     * </p>
     * @class KinematicRigidBodyFacetE3
     * @constructor
     * @param [type = 'KinematicRigidBodyFacetE3'] {string} The name used for reference counting.
     */
    constructor(type: string = 'KinematicRigidBodyFacetE3') {
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
export = KinematicRigidBodyFacetE3