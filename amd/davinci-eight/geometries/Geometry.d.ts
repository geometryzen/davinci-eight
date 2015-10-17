import GeometryElements = require('../geometries/GeometryElements');
import GeometryMeta = require('../geometries/GeometryMeta');
import Shareable = require('../utils/Shareable');
import Simplex = require('../geometries/Simplex');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
/**
 * @class Geometry
 * @extends Shareable
 */
declare class Geometry extends Shareable {
    /**
     * The geometry as a list of simplices.
     * A simplex, in the context of WebGL, will usually represent a triangle, line or point.
     * @property data
     * @type {Simplex[]}
     */
    data: Simplex[];
    /**
     * Summary information on the simplices such as dimensionality and sizes for attributes.
     * This data structure may be used to map vertex attribute names to program names.
     * @property meta
     * @type {GeometryMeta}
     */
    meta: GeometryMeta;
    /**
     * The dimensionality of the simplices in this geometry.
     * @property _k
     * @type {number}
     * @private
     */
    private _k;
    /**
     * Specifies the number of segments to use in curved directions.
     * @property curvedSegments
     * @type {number}
     */
    curvedSegments: number;
    /**
     * Specifies the number of segments to use on flat surfaces.
     * @property flatSegments
     * @type {number}
     */
    flatSegments: number;
    /**
     * <p>
     * Specifies that the geometry should set colors on vertex attributes
     * for visualizing orientation of triangles
     * </p>
     * @property orientationColors
     * @type {boolean}
     */
    orientationColors: boolean;
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
    /**
     * <p>
     * The dimensionality of the simplices in this geometry.
     * </p>
     * <p>
     * The <code>k</code> parameter affects geometry generation.
     * </p>
     * <code>k</code> must be an integer.
     * @property k
     * @type {number}
     */
    k: number;
    /**
     * Used to regenerate the simplex data from geometry parameters.
     * This method should be implemented by the derived geometry class.
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
    /**
     * Used to determine whether the geometry must be recalculated.
     * The base implementation is pessimistic and returns <code>true</code>.
     * This method should be implemented by the derived class to reduce frequent recalculation.
     * @method isModified
     * @return {boolean} if the parameters defining the geometry have been modified.
     */
    isModified(): boolean;
    /**
     * Sets the modification state of <code>this</code> instance.
     * Derived classes should override this method if they contain parameters which affect geometry calculation.
     * @method setModified
     * @param modified {boolean} The value that the modification state will be set to.
     * @return {Geometry} `this` instance.
     * @chainable
     */
    setModified(modified: boolean): Geometry;
    /**
     * <p>
     * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
     * </p>
     * <p>
     * The boundary operation converts simplices of dimension `n` to `n - 1`.
     * For example, triangles are converted to lines.
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
     * @beta
     */
    check(): Geometry;
    /**
     * <p>
     * Applies the subdivide operation to each Simplex in this instance the specified number of times.
     * </p>
     * <p>
     * The subdivide operation creates new simplices of the same dimension as the originals.
     * </p>
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
     * @method mergeVertices
     * @param precisionPonts [number = 4]
     * @return {void}
     * @protected
     * @beta
     */
    protected mergeVertices(precisionPoints?: number): void;
    /**
     * Convenience method for pushing attribute data as a triangular simplex
     * @method triangle
     * @param positions {Vector3[]}
     * @param normals {Vector3[]}
     * @param uvs {Vector2[]}
     * @return {number}
     * @beta
     */
    triangle(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number;
    lineSegment(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number;
    point(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number;
    empty(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number;
}
export = Geometry;
