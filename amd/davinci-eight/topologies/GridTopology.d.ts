import MeshTopology = require('../topologies/MeshTopology');
import Vertex = require('../geometries/Vertex');
/**
 * @class GridTopology
 * @extends MeshTopology
 */
declare class GridTopology extends MeshTopology {
    /**
     * <p>
     * The number of points for each dimension (dimensions<sub>i</sub> = segmentCounts<sub>i</sub> + 1).
     * </p>
     * @property dimensions
     * @type {number[]}
     */
    dimensions: number[];
    /**
     * <p>
     * Constructs a grid that is open on all sides and rendered using <code>TRIANGLE_STRIP</code>.
     * </p>
     * <p>
     * The grid orientation is such that when the first dimension is aligned to east,
     * and the second dimension is aligned to north,
     * the orientation is positive (counterclockwise) when viewed from above.
     * </p>
     * @class GridTopology
     * @constructor
     * @param segmentCounts {number[]} The number of segments for each dimension.
     * @example
         // Create a new topology with 5 segments in the first dimension, and 3 segments in the second dimension.
         var topo = new EIGHT.GridTopology([5, 3]);
         // Set attributes on each vertex ...
         // Compute the elements required for drawing
         var elements: EIGHT.GeometryElements = topo.toElements()
     */
    constructor(segmentCounts: number[]);
    /**
     * Provides access to each vertex so that attributes may be set.
     * @method vertex
     * @param coordinates {number[]} The integral coordinates of the vertex required.
     * @return {Vertex} The vertex corresponding to the specified coordinates.
     * @example
         var topo = new EIGHT.GridTopology([1, 1])
         topo.vertex([i, j]).attributes('aPosition') = new Vector3([i - 0.5, j - 0.5, 0])
     */
    vertex(coordinates: number[]): Vertex;
}
export = GridTopology;
