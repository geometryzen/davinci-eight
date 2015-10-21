import Euclidean3 = require('../math/Euclidean3')
import ModelFacet = require('../models/ModelFacet')
import MutableVectorE3 = require('../math/MutableVectorE3')
import MutableSpinorE3 = require('../math/MutableSpinorE3')

/**
 * @class KinematicRigidBodyFacetE3
 * @extends ModelFacet
 */
class KinematicRigidBodyFacetE3 extends ModelFacet {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {MutableVectorE3}
     */
    public V: MutableVectorE3 = new MutableVectorE3().copy(Euclidean3.zero);
    /**
     * <p>
     * The <em>rotational velocity</em>, a spinor.
     * </p>
     * @property Ω
     * @type {MutableSpinorE3}
     */
    public Ω: MutableSpinorE3 = new MutableSpinorE3();
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