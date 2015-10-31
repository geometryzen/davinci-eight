import ModelE2 = require('../physics/ModelE2');
import G2 = require('../math/G2');
/**
 * @class RigidBodyE2
 * @extends ModelE2
 */
declare class RigidBodyE2 extends ModelE2 {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {G2}
     */
    V: G2;
    /**
     * <p>
     * The <em>rotational velocity</em>, a spinor.
     * </p>
     * @property Ω
     * @type {G2}
     */
    Ω: G2;
    /**
     * <p>
     * Constructs a RigidBodyE2.
     * </p>
     * @class RigidBodyE2
     * @constructor
     * @param [type = 'RigidBodyE2'] {string} The name used for reference counting.
     */
    constructor(type?: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
}
export = RigidBodyE2;
