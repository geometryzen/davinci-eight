import DrawMode from '../core/DrawMode';
import isDefined from '../checks/isDefined';
import MeshTopology from '../topologies/MeshTopology';
import mustBeArray from '../checks/mustBeArray';
import mustBeInteger from '../checks/mustBeInteger';
import readOnly from '../i18n/readOnly';
import Vertex from '../geometries/Vertex';

function numPostsForFence(segmentCount: number): number {
    mustBeInteger('segmentCount', segmentCount)
    return segmentCount + 1
}

function dimensionsForGrid(segmentCounts: number[]): number[] {
    mustBeArray('segmentCounts', segmentCounts)
    return segmentCounts.map(numPostsForFence)
}

function numVerticesForGrid(uSegments: number, vSegments: number): number {
    mustBeInteger('uSegments', uSegments)
    mustBeInteger('vSegments', vSegments)
    return dimensionsForGrid([uSegments, vSegments]).reduce((a: number, b: number) => { return a * b }, 1)
}

function triangleStripForGrid(uSegments: number, vSegments: number, elements?: number[]): number[] {
    // Make sure that we have somewhere valid to store the result.
    elements = isDefined(elements) ? mustBeArray('elements', elements) : []

    let uLength = numPostsForFence(uSegments)
    let lastVertex = uSegments + uLength * vSegments
    /**
     * The number of elements needed if we executed a strip per row.
     * Remark Notice the asymmetry. Could be a performance impact.
     */
    var eSimple = 2 * uLength * vSegments
    /**
     * Index for triangle strip array.
     */
    var j = 0;
    // FIXME: Loop 0 <= i < eSimple (Edsger W. Dijksta)
    // For this algorithm, imagine a little vertical loop containing two dots.
    // The uppermost dot we shall call the `top` and the lowermost the `bottom`.
    // Advancing i by two each time corresponds to advancing this loop one place to the right.
    for (var i = 1; i <= eSimple; i += 2) {
        let k = (i - 1) / 2 // etc
        // top element
        elements[j] = (i - 1) / 2
        // bottom element
        elements[j + 1] = elements[j] + uLength
        // check for end of column
        if (elements[j + 1] % uLength === uSegments) {
            // Don't add degenerate triangles if we are on either
            // 1. the last vertex of the first row
            // 2. the last vertex of the last row.
            if (elements[j + 1] !== uSegments && elements[j + 1] !== lastVertex) {
                // additional vertex degenerate triangle
                // The next point is the same as the one before
                elements[j + 2] = elements[j + 1]
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
export default class GridTopology extends MeshTopology {
    private _uSegments: number;
    private _vSegments: number;
    constructor(uSegments: number, vSegments: number) {
        super(DrawMode.TRIANGLE_STRIP, numVerticesForGrid(uSegments, vSegments))
        this.elements = triangleStripForGrid(uSegments, vSegments)
        this._uSegments = uSegments
        this._vSegments = vSegments
    }
    get uSegments(): number {
        return this._uSegments
    }
    set uSegments(unused: number) {
        throw new Error(readOnly('uSegments').message)
    }
    get uLength(): number {
        return numPostsForFence(this._uSegments)
    }
    set uLength(unused: number) {
        throw new Error(readOnly('uLength').message)
    }
    get vSegments(): number {
        return this._vSegments
    }
    set vSegments(unused: number) {
        throw new Error(readOnly('vSegments').message)
    }
    get vLength(): number {
        return numPostsForFence(this._vSegments)
    }
    set vLength(unused: number) {
        throw new Error(readOnly('vLength').message)
    }
    /**
     * <p>
     * Provides access to each vertex so that attributes may be set.
     * The indices 
     * </p>
     * @method vertex
     * @param uIndex {number} The zero-based `horizontal` index.
     * @param vIndex {number} The zero-based 'vertical` index.
     * @return {Vertex} The vertex corresponding to the specified coordinates.
     * @example
         var topo = new EIGHT.GridTopology(1, 1)
         topo.vertex(uIndex, vIndex).attributes('aPosition') = new R3([i - 0.5, j - 0.5, 0])
     */
    vertex(uIndex: number, vIndex: number): Vertex {
        mustBeInteger('uIndex', uIndex)
        mustBeInteger('vIndex', vIndex)
        return this.vertices[(this._vSegments - vIndex) * this.uLength + uIndex]
    }
}
