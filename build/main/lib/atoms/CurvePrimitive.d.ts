import { BeginMode } from '../core/BeginMode';
import { Transform } from './Transform';
import { Vertex } from './Vertex';
import { VertexPrimitive } from './VertexPrimitive';
/**
 *
 */
export declare class CurvePrimitive extends VertexPrimitive {
    private _uSegments;
    private _uClosed;
    /**
     * @param mode
     * @param uSegments
     * @param uClosed
     */
    constructor(mode: BeginMode, uSegments: number, uClosed: boolean);
    uSegments: number;
    /**
     * uLength = uSegments + 1
     */
    uLength: number;
    vertexTransform(transform: Transform): void;
    vertex(uIndex: number): Vertex;
}
