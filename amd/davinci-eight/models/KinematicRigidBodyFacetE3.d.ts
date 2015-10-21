import ModelFacet = require('../models/ModelFacet');
import MutableVectorE3 = require('../math/MutableVectorE3');
import MutableSpinorE3 = require('../math/MutableSpinorE3');
/**
 * @class KinematicRigidBodyFacetE3
 * @extends ModelFacet
 */
declare class KinematicRigidBodyFacetE3 extends ModelFacet {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {MutableVectorE3}
     */
    V: MutableVectorE3;
    /**
     * <p>
     * The <em>rotational velocity</em>, a spinor.
     * </p>
     * @property Ω
     * @type {MutableSpinorE3}
     */
    Ω: MutableSpinorE3;
    /**
     * <p>
     * Constructs a KinematicRigidBodyFacetE3.
     * </p>
     * @class KinematicRigidBodyFacetE3
     * @constructor
     * @param [type = 'KinematicRigidBodyFacetE3'] {string} The name used for reference counting.
     */
    constructor(type?: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
}
export = KinematicRigidBodyFacetE3;
