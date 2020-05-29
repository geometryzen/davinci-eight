import { __extends } from "tslib";
import { BeginMode } from '../core/BeginMode';
import { GridPrimitive } from './GridPrimitive';
import { mustBeInteger } from '../checks/mustBeInteger';
import { numPostsForFence } from './numPostsForFence';
/**
 * Computes the vertex index from integer coordinates.
 * Both lengths are included for symmetry!
 */
function vertexIndex(i, j, iLength, jLength) {
    mustBeInteger('iLength', iLength);
    mustBeInteger('jLength', jLength);
    return j * iLength + i;
}
function linesForGrid(uSegments, uClosed, vSegments, vClosed) {
    var iLength = numPostsForFence(uSegments, uClosed);
    var jLength = numPostsForFence(vSegments, vClosed);
    var elements = [];
    for (var i = 0; i < iLength; i++) {
        for (var j = 0; j < jLength; j++) {
            // The first line is in the direction of increasing i.
            // 
            if (i < uSegments) {
                elements.push(vertexIndex(i, j, iLength, jLength));
                elements.push(vertexIndex(i + 1, j, iLength, jLength));
            }
            // The second line is in the direction of increasing j.
            if (j < vSegments) {
                elements.push(vertexIndex(i, j, iLength, jLength));
                elements.push(vertexIndex(i, j + 1, iLength, jLength));
            }
        }
    }
    return elements;
}
var GridLines = /** @class */ (function (_super) {
    __extends(GridLines, _super);
    /**
     * @param uSegments
     * @param uClosed
     * @param vSegments
     * @param vClosed
     */
    function GridLines(uSegments, uClosed, vSegments, vClosed) {
        var _this = _super.call(this, BeginMode.LINES, uSegments, vSegments) || this;
        _this.elements = linesForGrid(uSegments, uClosed, vSegments, vClosed);
        var iLength = numPostsForFence(uSegments, uClosed);
        var jLength = numPostsForFence(vSegments, vClosed);
        for (var i = 0; i < iLength; i++) {
            for (var j = 0; j < jLength; j++) {
                var coords = _this.vertex(i, j).coords;
                coords.setComponent(0, i);
                coords.setComponent(1, j);
            }
        }
        return _this;
    }
    /**
     * @method vertex
     * @param i An integer. 0 <= i < uLength
     * @param j An integer. 0 <= j < vLength
     */
    GridLines.prototype.vertex = function (i, j) {
        mustBeInteger('i', i);
        mustBeInteger('j', j);
        return this.vertices[vertexIndex(i, j, this.uLength, this.vLength)];
    };
    return GridLines;
}(GridPrimitive));
export { GridLines };
