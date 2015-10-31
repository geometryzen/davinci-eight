import ModelE3 = require('../physics/ModelE3');
import G3 = require('../math/G3');
/**
 * @class RigidBodyE3
 * @extends ModelE3
 */
declare class RigidBodyE3 extends ModelE3 {
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
     * Constructs a RigidBodyE3.
     * </p>
     * @class RigidBodyE3
     * @constructor
     * @param [type = 'RigidBodyE3'] {string} The name used for reference counting.
     */
    constructor(type?: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
}
export = RigidBodyE3;
