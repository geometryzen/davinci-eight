import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { Vector2 } from '../math/Vector2';
/**
 * Applies coordinates to a surface.
 */
var CoordsTransform2D = /** @class */ (function () {
    function CoordsTransform2D(flipU, flipV, exchangeUV) {
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
    CoordsTransform2D.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var u = i / (iLength - 1);
        var v = j / (jLength - 1);
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector2([u, v]);
    };
    return CoordsTransform2D;
}());
export { CoordsTransform2D };
