import Geometry = require('../geometries/Geometry');
import GeometryInfo = require('../dfx/GeometryInfo');
import Simplex = require('../dfx/Simplex');
/**
 * @class Complex
 */
declare class Complex {
    /**
     * @property data
     * @type {Simplex[]}
     */
    data: Simplex[];
    /**
     * Summary information on the simplices such as dimensionality and sizes for attributes.
     * This same data structure may be used to map vertex attribute names to program names.
     * @property meta
     * @type {GeometryInfo}
     */
    meta: GeometryInfo;
    dynamic: boolean;
    verticesNeedUpdate: boolean;
    elementsNeedUpdate: boolean;
    uvsNeedUpdate: boolean;
    /**
     * @class Complex
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
     * @return {Complex}
     */
    boundary(times?: number): Complex;
    /**
     * Updates the meta property of this instance to match the data.
     *
     * @method check
     * @return {Complex}
     */
    check(): Complex;
    /**
     * Applies the subdivide operation to each Simplex in this instance the specified number of times.
     *
     * @method subdivide
     * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
     * @return {Complex}
     */
    subdivide(times?: number): Complex;
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
export = Complex;
