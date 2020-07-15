import { BeginMode } from '../core/BeginMode';
import { mustBeInteger } from '../checks/mustBeInteger';
import { numPostsForFence } from './numPostsForFence';
import { numVerticesForGrid } from './numVerticesForGrid';
import { notSupported } from '../i18n/notSupported';
import { readOnly } from '../i18n/readOnly';
import { Transform } from './Transform';
import { Vertex } from './Vertex';
import { VertexPrimitive } from './VertexPrimitive';

/**
 * Used for creating a VertexPrimitive for a surface.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 */
export class GridPrimitive extends VertexPrimitive {

    private _uSegments: number;
    private _uClosed = false;
    private _vSegments: number;
    private _vClosed = false;

    constructor(mode: BeginMode, uSegments: number, vSegments: number) {
        super(mode, numVerticesForGrid(uSegments, vSegments), 2);
        this._uSegments = uSegments;
        this._vSegments = vSegments;
    }

    get uSegments(): number {
        return this._uSegments;
    }
    set uSegments(uSegments: number) {
        mustBeInteger('uSegments', uSegments);
        throw new Error(readOnly('uSegments').message);
    }

    /**
     * uLength = uSegments + 1
     */
    get uLength(): number {
        return numPostsForFence(this._uSegments, this._uClosed);
    }
    set uLength(uLength: number) {
        mustBeInteger('uLength', uLength);
        throw new Error(readOnly('uLength').message);
    }

    get vSegments(): number {
        return this._vSegments;
    }
    set vSegments(vSegments: number) {
        mustBeInteger('vSegments', vSegments);
        throw new Error(readOnly('vSegments').message);
    }

    /**
     * vLength = vSegments + 1
     */
    get vLength(): number {
        return numPostsForFence(this._vSegments, this._vClosed);
    }
    set vLength(vLength: number) {
        mustBeInteger('vLength', vLength);
        throw new Error(readOnly('vLength').message);
    }

    public vertexTransform(transform: Transform): void {
        const iLen = this.vertices.length;
        for (let i = 0; i < iLen; i++) {
            const vertex = this.vertices[i];
            const u = vertex.coords.getComponent(0);
            const v = vertex.coords.getComponent(1);
            transform.exec(vertex, u, v, this.uLength, this.vLength);
        }
    }

    /**
     * Derived classes must override.
     */
    vertex(i: number, j: number): Vertex {
        mustBeInteger('i', i);
        mustBeInteger('j', j);
        throw new Error(notSupported('vertex').message);
    }
}
