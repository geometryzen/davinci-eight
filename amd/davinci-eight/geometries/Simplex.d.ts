import Vertex = require('../geometries/Vertex');
import VectorN = require('../math/VectorN');
/**
 * @class Simplex
 */
declare class Simplex {
    /**
     * The vertices of the simplex.
     * @property
     * @type {Vertex[]}
     */
    vertices: Vertex[];
    /**
     * A simplex is the generalization of a point, line, triangle or tetrahedron to arbitrary dimensions.
     * A k-simplex is the convex hull of its k + 1 vertices.
     * @class Simplex
     * @constructor
     * @param k {number} The initial number of vertices in the simplex is k + 1.
     */
    constructor(k: number);
    /**
     * The dimensionality of the simplex.
     * @property k
     * @type {number}
     * @readonly
     */
    k: number;
    /**
     * An empty set can be consired to be a -1 simplex (algebraic topology).
     * @property EMPTY
     * @type {number}
     * @static
     */
    static EMPTY: number;
    /**
     * A single point may be considered a 0-simplex.
     * @property POINT
     * @type {number}
     * @static
     */
    static POINT: number;
    /**
     * A line segment may be considered a 1-simplex.
     * @property LINE
     * @type {number}
     * @static
     */
    static LINE: number;
    /**
     * A 2-simplex is a triangle.
     * @property TRIANGLE
     * @type {number}
     * @static
     */
    static TRIANGLE: number;
    /**
     * A 3-simplex is a tetrahedron.
     * @property TETRAHEDRON
     * @type {number}
     * @static
     */
    static TETRAHEDRON: number;
    /**
     * A 4-simplex is a 5-cell.
     * @property FIVE_CELL
     * @type {number}
     * @static
     */
    static FIVE_CELL: number;
    /**
     * @deprecated
     */
    static indices(simplex: Simplex): number[];
    /**
     * Computes the boundary of the simplex.
     * @method boundaryMap
     * @param simplex {Simplex}
     * @return {Simplex[]}
     * @private
     */
    private static boundaryMap(simplex);
    private static subdivideMap(simplex);
    /**
     * Computes the result of the boundary operation performed `count` times.
     * @method boundary
     * @param simplices {Simplex[]}
     * @param count {number}
     * @return {Simplex[]}
     */
    static boundary(simplices: Simplex[], count?: number): Simplex[];
    /**
     * Computes the result of the subdivide operation performed `count` times.
     * @method subdivide
     * @param simplices {Simplex[]}
     * @param count {number}
     * @return {Simplex[]}
     */
    static subdivide(simplices: Simplex[], count?: number): Simplex[];
    static setAttributeValues(attributes: {
        [name: string]: VectorN<number>[];
    }, simplex: Simplex): void;
}
export = Simplex;
