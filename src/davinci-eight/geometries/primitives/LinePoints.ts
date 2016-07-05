import CurvePrimitive from './CurvePrimitive';
import BeginMode from '../../core/BeginMode';
import elementsForCurve from './elementsForCurve';
import mustBeGE from '../../checks/mustBeGE';
import mustBeInteger from '../../checks/mustBeInteger';
import mustBeLT from '../../checks/mustBeLT';
import Vertex from './Vertex'

/**
 * @module EIGHT
 * @submodule primitives
 */

export default class LinePoints extends CurvePrimitive {

    /**
     * @class LinePoints
     * @constructor
     * @param uSegments {number}
     */
    constructor(uSegments: number) {
        super(BeginMode.POINTS, uSegments, false)
        // We are rendering a LINE_STRIP so the figure will not be closed.
        this.elements = elementsForCurve(uSegments, false)
    }

    /**
     * @method vertex
     * @param uIndex {number} An integer. 0 <= uIndex < uLength
     * @return {Vertex}
     */
    vertex(uIndex: number): Vertex {
        mustBeInteger('uIndex', uIndex)
        mustBeGE('uIndex', uIndex, 0)
        mustBeLT('uIndex', uIndex, this.uLength)
        return this.vertices[uIndex]
    }
}
