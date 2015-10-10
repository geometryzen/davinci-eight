import GeometryElements = require('../geometries/GeometryElements');
import GeometryMeta = require('../geometries/GeometryMeta');
import Shareable = require('../utils/Shareable');
import Simplex = require('../geometries/Simplex');
/**
 * @class Geometry
 * @extends Shareable
 */
declare class Geometry extends Shareable {
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
     * <p>
     * A list of simplices (data) with information about dimensionality and vertex properties (meta).
     * This class should be used as an abstract base or concrete class when constructing
     * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
     * The <code>Geometry</code> class implements IUnknown, as a convenience to implementations
     * requiring special de-allocation of resources, by extending <code>Shareable</code>.
     * </p>
     * @class Geometry
     * @constructor
     * @param type [string = 'Geometry']
     */
    constructor(type?: string);
    /**
     * The destructor method should be implemented in derived classes and the super.destructor called
     * as the last call in the derived class destructor.
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    recalculate(): void;
    isModified(): boolean;
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
