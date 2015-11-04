import ModelFacetE3 = require('../facets/ModelFacetE3');
import G3 = require('../math/G3');
/**
 * @class RigidBodyFacetE3
 * @extends ModelFacetE3
 */
declare class RigidBodyFacetE3 extends ModelFacetE3 {
    /**
     * <p>
     * The <em>linear velocity</em>, a vector.
     * </p>
     * @property V
     * @type {G3}
     * @default 0
     */
    V: G3;
    /**
     * <p>
     * The <em>rotational velocity</em>, a bivector.
     * </p>
     * @property Ω
     * @type {G3}
     * @default <b>1</b>
     */
    Ω: G3;
    /**
     * <p>
     * Constructs a RigidBodyFacetE3.
     * </p>
     * @class RigidBodyFacetE3
     * @constructor
     * @param [type = 'RigidBodyFacetE3'] {string} The name used for reference counting.
     */
    constructor(type?: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): void;
}
export = RigidBodyFacetE3;
