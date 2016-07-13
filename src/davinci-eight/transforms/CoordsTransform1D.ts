import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import mustBeBoolean from '../checks/mustBeBoolean'
import Vector1 from '../math/Vector1'
import Vertex from '../atoms/Vertex'
import Transform from '../atoms/Transform'

/**
 * Applies coordinates to a line.
 *
 * @class CoordsTransform1D
 */
export default class CoordsTransform1D implements Transform {
    public flipU: boolean
    constructor(flipU: boolean) {
        this.flipU = mustBeBoolean('flipU', flipU)
    }

    /**
     * @method exec
     * @param vertex {Vertex}
     * @param i {number}
     * @param j {number}
     * @param iLength {number}
     * @param jLength {number}
     */
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        const u = i / (iLength - 1)
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector1([u])
    }
}
