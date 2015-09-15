import Vertex = require('../dfx/Vertex');
import VectorN = require('../math/VectorN');
/**
 * A simplex is the generalization of a triangle or tetrahedron to arbitrary dimensions.
 * A k-simplex is the convex hull of its k + 1 vertices.
 */
declare class Simplex {
    vertices: Vertex[];
    /**
     * @class Simplex
     * @constructor
     * @param k {number} The initial number of vertices in the simplex is k + 1.
     */
    constructor(k: number);
    k: number;
    /**
     * An empty set can be consired to be a -1 simplex (algebraic topology).
     */
    static K_FOR_EMPTY: number;
    /**
     * A single point may be considered a 0-simplex.
     */
    static K_FOR_POINT: number;
    /**
     * A line segment may be considered a 1-simplex.
     */
    static K_FOR_LINE_SEGMENT: number;
    /**
     * A 2-simplex is a triangle.
     */
    static K_FOR_TRIANGLE: number;
    /**
     * A 3-simplex is a tetrahedron.
     */
    static K_FOR_TETRAHEDRON: number;
    /**
     * A 4-simplex is a 5-cell.
     */
    static K_FOR_FIVE_CELL: number;
    /**
     *
     */
    static indices(simplex: Simplex): number[];
    /**
     * Computes the boundary of the simplex.
     */
    private static boundaryMap(simplex);
    private static subdivideMap(simplex);
    static boundary(geometry: Simplex[], count?: number): Simplex[];
    static subdivide(geometry: Simplex[], count?: number): Simplex[];
    static setAttributeValues(attributes: {
        [name: string]: VectorN<number>[];
    }, simplex: Simplex): void;
}
export = Simplex;
