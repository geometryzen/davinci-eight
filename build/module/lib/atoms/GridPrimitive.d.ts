import { BeginMode } from '../core/BeginMode';
import { Transform } from './Transform';
import { Vertex } from './Vertex';
import { VertexPrimitive } from './VertexPrimitive';
/**
 * Used for creating a VertexPrimitive for a surface.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 */
export declare class GridPrimitive extends VertexPrimitive {
    private _uSegments;
    private _uClosed;
    private _vSegments;
    private _vClosed;
    constructor(mode: BeginMode, uSegments: number, vSegments: number);
    get uSegments(): number;
    set uSegments(uSegments: number);
    /**
     * uLength = uSegments + 1
     */
    get uLength(): number;
    set uLength(uLength: number);
    get vSegments(): number;
    set vSegments(vSegments: number);
    /**
     * vLength = vSegments + 1
     */
    get vLength(): number;
    set vLength(vLength: number);
    vertexTransform(transform: Transform): void;
    /**
     * Derived classes must override.
     */
    vertex(i: number, j: number): Vertex;
}
