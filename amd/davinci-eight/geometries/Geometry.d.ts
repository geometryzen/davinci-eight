import GeometryElements = require('../geometries/GeometryElements');
import GeometryMeta = require('../geometries/GeometryMeta');
import Simplex = require('../geometries/Simplex');
/**
 * @class Geometry
 */
declare class Geometry {
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
    /**
     * A list of simplices (data) with information about dimensionality and vertex properties (meta).
     * This class should be used as an abstract base or concrete class when constructing
     * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
     * @class Geometry
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
     * @return {Geometry}
     */
    boundary(times?: number): Geometry;
    /**
     * Updates the meta property of this instance to match the data.
     *
     * @method check
     * @return {Geometry}
     */
    check(): Geometry;
    /**
     * Applies the subdivide operation to each Simplex in this instance the specified number of times.
     *
     * @method subdivide
     * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
     * @return {Geometry}
     */
    subdivide(times?: number): Geometry;
    /**
     * @method toGeometry
     * @return {GeometryElements}
     */
    toElements(): GeometryElements;
    /**
     *
     */
    protected mergeVertices(precisionPoints?: number): void;
}
export = Geometry;
