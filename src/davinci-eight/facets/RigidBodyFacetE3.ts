import Euclidean3 = require('../math/Euclidean3')
import ModelFacetE3 = require('../facets/ModelFacetE3')
import G3 = require('../math/G3')

/**
 * @class RigidBodyFacetE3
 * @extends ModelFacetE3
 */
class RigidBodyFacetE3 extends ModelFacetE3 {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {G3}
     * @default 0
     */
    public V: G3 = new G3().zero();

    /**
     * <p>
     * The <em>rotational velocity</em>, a bivector.
     * </p>
     * @property Ω
     * @type {G3}
     * @default <b>1</b>
     */
    public Ω: G3 = new G3().one();

    /**
     * <p>
     * Constructs a RigidBodyFacetE3.
     * </p>
     * @class RigidBodyFacetE3
     * @constructor
     * @param [type = 'RigidBodyFacetE3'] {string} The name used for reference counting.
     */
    constructor(type: string = 'RigidBodyFacetE3') {
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
    getProperty(name: string): number[] {
        return super.getProperty(name)
    }
    setProperty(name: string, value: number[]): void {
        return super.setProperty(name, value)
    }
}
export = RigidBodyFacetE3