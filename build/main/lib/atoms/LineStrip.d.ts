import { CurvePrimitive } from './CurvePrimitive';
import { Vertex } from './Vertex';
export declare class LineStrip extends CurvePrimitive {
    /**
     * @param uSegments
     */
    constructor(uSegments: number);
    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     */
    vertex(uIndex: number): Vertex;
}
