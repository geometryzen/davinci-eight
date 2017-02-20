import BeginMode from '../core/BeginMode';
import GridPrimitive from './GridPrimitive';
import mustBeInteger from '../checks/mustBeInteger';
import numPostsForFence from './numPostsForFence';
import Vertex from './Vertex';

/**
 * Computes the vertex index from integer coordinates.
 * Both lengths are included for symmetry!
 */
function vertexIndex(i: number, j: number, iLength: number, jLength: number): number {
    mustBeInteger('iLength', iLength);
    mustBeInteger('jLength', jLength);
    return j * iLength + i;
}

function pointsForGrid(uSegments: number, uClosed: boolean, vSegments: number, vClosed: boolean): number[] {
    const iLength = numPostsForFence(uSegments, uClosed);
    const jLength = numPostsForFence(vSegments, vClosed);
    const elements: number[] = [];
    for (let i = 0; i < iLength; i++) {
        for (let j = 0; j < jLength; j++) {
            elements.push(vertexIndex(i, j, iLength, jLength));
        }
    }
    return elements;
}

/**
 *
 */
export default class GridPoints extends GridPrimitive {

    /**
     * @param uSegments
     * @param uClosed
     * @param vSegments
     * @param vClosed
     */
    constructor(uSegments: number, uClosed: boolean, vSegments: number, vClosed: boolean) {
        super(BeginMode.POINTS, uSegments, vSegments);
        this.elements = pointsForGrid(uSegments, uClosed, vSegments, vClosed);
        const iLength = numPostsForFence(uSegments, uClosed);
        const jLength = numPostsForFence(vSegments, vClosed);
        for (let i = 0; i < iLength; i++) {
            for (let j = 0; j < jLength; j++) {
                const coords = this.vertex(i, j).coords;
                coords.setComponent(0, i);
                coords.setComponent(1, j);
            }
        }
    }

    /**
     * @param i An integer. 0 <= i < uLength
     * @param j An integer. 0 <= j < vLength
     */
    vertex(i: number, j: number): Vertex {
        mustBeInteger('i', i);
        mustBeInteger('j', j);
        return this.vertices[vertexIndex(i, j, this.uLength, this.vLength)];
    }
}
