import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Vector2 } from '../math/Vector2';

/**
 * Applies coordinates to a surface.
 * @hidden
 */
export class CoordsTransform2D implements Transform {
    public flipU: boolean;
    public flipV: boolean;
    public exchageUV: boolean;
    constructor(flipU: boolean, flipV: boolean, exchangeUV: boolean) {
        this.flipU = mustBeBoolean('flipU', flipU);
        this.flipV = mustBeBoolean('flipV', flipV);
        this.exchageUV = mustBeBoolean('exchangeUV', exchangeUV);
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
        const u = i / (iLength - 1);
        const v = j / (jLength - 1);
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector2([u, v]);
    }
}
