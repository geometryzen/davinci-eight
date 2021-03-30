import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeLT } from '../checks/mustBeLT';
import { BeginMode } from '../core/BeginMode';
import { readOnly } from '../i18n/readOnly';
import { numPostsForFence } from './numPostsForFence';
import { numVerticesForCurve } from './numVerticesForCurve';
import { Transform } from './Transform';
import { Vertex } from './Vertex';
import { VertexPrimitive } from './VertexPrimitive';

/**
 * @hidden
 */
export class CurvePrimitive extends VertexPrimitive {

    private _uSegments: number;

    private _uClosed: boolean;

    /**
     * @param mode
     * @param uSegments
     * @param uClosed
     */
    constructor(mode: BeginMode, uSegments: number, uClosed: boolean) {
        super(mode, numVerticesForCurve(uSegments), 1);
        mustBeInteger('uSegments', uSegments);
        mustBeGE('uSegments', uSegments, 0);
        mustBeBoolean('uClosed', uClosed);
        this._uSegments = uSegments;
        this._uClosed = uClosed;
        const uLength = this.uLength;
        for (let uIndex = 0; uIndex < uLength; uIndex++) {
            const coords = this.vertex(uIndex).coords;
            coords.setComponent(0, uIndex);
        }
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

    public vertexTransform(transform: Transform): void {
        const iLen = this.vertices.length;
        for (let i = 0; i < iLen; i++) {
            const vertex = this.vertices[i];
            const u = vertex.coords.getComponent(0);
            transform.exec(vertex, u, 0, this.uLength, 0);
        }
    }

    public vertex(uIndex: number): Vertex {
        mustBeInteger('uIndex', uIndex);
        mustBeGE('uIndex', uIndex, 0);
        mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    }
}
