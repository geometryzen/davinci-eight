import CurvePrimitive from './CurvePrimitive';
import BeginMode from '../core/BeginMode';
import elementsForCurve from './elementsForCurve';
import mustBeGE from '../checks/mustBeGE';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeLT from '../checks/mustBeLT';
import Vertex from './Vertex';

/**
 * 
 */
export default class LinePoints extends CurvePrimitive {
    /**
     * @param uSegments
     */
    constructor(uSegments: number) {
        super(BeginMode.POINTS, uSegments, false);
        this.elements = elementsForCurve(uSegments, false);
    }

    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     */
    vertex(uIndex: number): Vertex {
        mustBeInteger('uIndex', uIndex);
        mustBeGE('uIndex', uIndex, 0);
        mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    }
}
