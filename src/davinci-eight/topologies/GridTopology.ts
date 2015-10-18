import DrawMode = require('../core/DrawMode')
import isDefined = require('../checks/isDefined')
import MeshTopology = require('../topologies/MeshTopology')
import mustBeInteger = require('../checks/mustBeInteger')
import Vertex = require('../geometries/Vertex')

function numPostsForFence(segmentCount: number): number {
    return segmentCount + 1
}

function dimensionsForGrid(segmentCounts: number[]): number[] {
    return segmentCounts.map(numPostsForFence)
}

function numVerticesForGrid(segmentCounts: number[]): number {
    return dimensionsForGrid(segmentCounts).reduce((a, b) => { return a * b }, 1)
}

/**
 * Computes the triangleStripForGrid traversal for a grid.
 * param iLength The number of points in the i direction, iLength = iSegments + 1
 * param jLength The number of points in the j direction, jLength = jSegments + 1
 * param elements Optional 
 * return The traversal result.
 */
function triangleStripForGrid(iLength: number, jLength: number, elements?: number[]): number[] {
    // Make sure that we have somewhere valid to store the result.
    elements = isDefined(elements) ? elements : []

    let jSegments = jLength - 1
    /**
     * The number of elements needed if we executed a strip per row segment.
     * Remark Notice the asymmetry. Could be a performance impact.
     */
    var RCvertices = 2 * iLength * jSegments
    /**
     * The number of elements including the duplicate elements needed to create
     * the degenerate triangles for a single strip call.
     */
    var eLength = RCvertices + 2 * (jLength - 2)
    /**
     * Index for triangle strip array.
     */
    var j = 0;
    // FIXME: Loop 0 <= i < RCvertices (Edsger W. Dijksta)
    // For this algorithm, imagine a little vertical loop containing two dots.
    // The uppermost dot we shall call the `top` and the lowermost the `bottom`.
    // Advancing i by two each time corresponds to advancing this loop one place to the right.
    for (var i = 1; i <= RCvertices; i += 2) {
        // top element
        elements[j] = (i - 1) / 2;
        // bottom element
        elements[j + 1] = (iLength * 2 + i + 1 - 2) / 2;
        // check for end of column
        if ((elements[j + 1] + 1) % iLength === 0) {
            // skip first and last row
            if ((elements[j + 1] + 1) != iLength && (elements[j + 1] + 1) != iLength * jLength) {
                // additional vertex degenerate triangle
                // The next point is the same as the one before
                elements[j + 2] = elements[j + 1];
                // additional vertex degenerate triangle
                // 
                elements[j + 3] = (1 + i) / 2;
                // Increment j for the two duplicate vertices
                j += 2;
            }
        }
        // Increment j for this step.
        j += 2;
    }
    return elements
}

/**
 * @class GridTopology
 * @extends MeshTopology
 */
class GridTopology extends MeshTopology {
    /**
     * <p>
     * The number of points for each dimension (dimensions<sub>i</sub> = segmentCounts<sub>i</sub> + 1).
     * </p>
     * @property dimensions
     * @type {number[]}
     */
    public dimensions: number[];
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
    constructor(segmentCounts: number[]) {
        super(DrawMode.TRIANGLE_STRIP, numVerticesForGrid(segmentCounts))
        this.dimensions = dimensionsForGrid(segmentCounts)
        this.elements = triangleStripForGrid(this.dimensions[0], this.dimensions[1])
    }
    /**
     * Provides access to each vertex so that attributes may be set.
     * @method vertex
     * @param coordinates {number[]} The integral coordinates of the vertex required.
     * @return {Vertex} The vertex corresponding to the specified coordinates.
     * @example
         var topo = new EIGHT.GridTopology([1, 1])
         topo.vertex([i, j]).attributes('aPosition') = new Vector3([i - 0.5, j - 0.5, 0])
     */
    vertex(coordinates: number[]): Vertex {
        var index = this.dimensions[0] * coordinates[1] + coordinates[0]
        return this.vertices[index]
    }
}

export = GridTopology