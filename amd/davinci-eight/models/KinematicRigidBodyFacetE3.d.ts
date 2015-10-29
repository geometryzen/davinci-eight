import ModelFacetE3 = require('../models/ModelFacetE3');
import G3 = require('../math/G3');
/**
 * @class KinematicRigidBodyFacetE3
 * @extends ModelFacetE3
 */
declare class KinematicRigidBodyFacetE3 extends ModelFacetE3 {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {G3}
     */
    V: G3;
    /**
     * <p>
     * The <em>rotational velocity</em>, a spinor.
     * </p>
     * @property Ω
     * @type {G3}
     */
    Ω: G3;
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
