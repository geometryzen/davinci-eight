import { mustBeBoolean } from '../checks/mustBeBoolean';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Vector1 } from '../math/Vector1';
/**
 * Applies coordinates to a line.
 * @hidden
 */
var CoordsTransform1D = /** @class */ (function () {
    function CoordsTransform1D(flipU) {
        this.flipU = mustBeBoolean('flipU', flipU);
    }
    CoordsTransform1D.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var u = i / (iLength - 1);
        vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector1([u]);
    };
    return CoordsTransform1D;
}());
export { CoordsTransform1D };
