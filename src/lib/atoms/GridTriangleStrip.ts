import { isDefined } from "../checks/isDefined";
import { mustBeArray } from "../checks/mustBeArray";
import { mustBeInteger } from "../checks/mustBeInteger";
import { BeginMode } from "../core/BeginMode";
import { GridPrimitive } from "./GridPrimitive";
import { numPostsForFence } from "./numPostsForFence";
import { Vertex } from "./Vertex";

/**
 * @hidden
 */
function triangleStripForGrid(uSegments: number, vSegments: number, elements?: number[]): number[] {
    // Make sure that we have somewhere valid to store the result.
    elements = isDefined(elements) ? mustBeArray("elements", elements) : [];

    const uLength = numPostsForFence(uSegments, false /* open */);
    const lastVertex = uSegments + uLength * vSegments;
    /**
     * The number of elements needed if we executed a strip per row.
     * Remark Notice the asymmetry. Could be a performance impact.
     */
    const eSimple = 2 * uLength * vSegments;
    /**
     * Index for TRIANGLE_STRIP array.
     */
    let j = 0;
    // FIXME: Loop 0 <= i < eSimple (Edsger W. Dijksta)
    // For this algorithm, imagine a little vertical loop containing two dots.
    // The uppermost dot we shall call the `top` and the lowermost the `bottom`.
    // Advancing i by two each time corresponds to advancing this loop one place to the right.
    for (let i = 1; i <= eSimple; i += 2) {
        // const k = (i - 1) / 2 // etc
        // top element
        elements[j] = (i - 1) / 2;
        // bottom element
        elements[j + 1] = elements[j] + uLength;
        // check for end of column
        if (elements[j + 1] % uLength === uSegments) {
            // Don't add degenerate triangles if we are on either
            // 1. the last vertex of the first row
            // 2. the last vertex of the last row.
            if (elements[j + 1] !== uSegments && elements[j + 1] !== lastVertex) {
                // additional vertex degenerate triangle
                // The next point is the same as the one before
                elements[j + 2] = elements[j + 1];
                // additional vertex degenerate triangle
                elements[j + 3] = (1 + i) / 2;
                // Increment j for the two duplicate vertices
                j += 2;
            }
        }
        // Increment j for this step.
        j += 2;
    }
    return elements;
}

/**
 * Used for creating TRIANGLE_STRIP primitives.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 * @hidden
 */
export class GridTriangleStrip extends GridPrimitive {
    /**
     * @param uSegments
     * @param vSegments
     */
    constructor(uSegments: number, vSegments: number) {
        super(BeginMode.TRIANGLE_STRIP, uSegments, vSegments);
        this.elements = triangleStripForGrid(uSegments, vSegments);
    }

    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     * @param vIndex An integer. 0 <= vIndex < vLength
     */
    vertex(uIndex: number, vIndex: number): Vertex {
        mustBeInteger("uIndex", uIndex);
        mustBeInteger("vIndex", vIndex);
        // I'm not sure why the indexing here reverses the second index direction.
        return this.vertices[(this.vSegments - vIndex) * this.uLength + uIndex];
    }
}
