import Geometry = require('../geometries/Geometry');
import GeometryMeta = require('../dfx/GeometryMeta');
import Simplex = require('../dfx/Simplex');
/**
 * @class Chain
 */
declare class Chain {
    /**
     * @property data
     * @type {Simplex[]}
     */
    data: Simplex[];
    /**
     * Summary information on the simplices such as dimensionality and sizes for attributes.
     * This same data structure may be used to map vertex attribute names to program names.
     * @property meta
     * @type {GeometryMeta}
     */
    meta: GeometryMeta;
    dynamic: boolean;
    verticesNeedUpdate: boolean;
    elementsNeedUpdate: boolean;
    uvsNeedUpdate: boolean;
    /**
     * A list of simplices (data) with information about dimensionality and vertex properties (meta).
     * @class Chain
     * @constructor
     */
    constructor();
    /**
     * <p>
     * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
     * </p>
     *
     * @method boundary
     * @param times {number} Determines the number of times the boundary operation is applied to this instance.
     * @return {Chain}
     */
    boundary(times?: number): Chain;
    /**
     * Updates the meta property of this instance to match the data.
     *
     * @method check
     * @return {Chain}
     */
    check(): Chain;
    /**
     * Applies the subdivide operation to each Simplex in this instance the specified number of times.
     *
     * @method subdivide
     * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
     * @return {Chain}
     */
    subdivide(times?: number): Chain;
    /**
     * @method toGeometry
     * @return {Geometry}
     */
    toGeometry(): Geometry;
    /**
     *
     */
    protected mergeVertices(precisionPoints?: number): void;
}
export = Chain;
