import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Vector1 } from '../math/Vector1';

/**
 * Applies coordinates to a line.
 * @hidden
 */
export class CoordsTransform1D implements Transform {
    public flipU: boolean;
    constructor(flipU: boolean) {
        this.flipU = mustBeBoolean('flipU', flipU);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        const u = i / (iLength - 1);
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector1([u]);
    }
}
