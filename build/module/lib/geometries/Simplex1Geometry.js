import { __extends } from "tslib";
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Simplex } from '../geometries/Simplex';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { Vector3 } from '../math/Vector3';
/**
 * @hidden
 */
var Simplex1Geometry = /** @class */ (function (_super) {
    __extends(Simplex1Geometry, _super);
    function Simplex1Geometry() {
        var _this = _super.call(this) || this;
        _this.head = new Vector3([1, 0, 0]);
        _this.tail = new Vector3([0, 1, 0]);
        _this.calculate();
        return _this;
    }
    Simplex1Geometry.prototype.calculate = function () {
        var pos = [0, 1].map(function (index) { return void 0; });
        pos[0] = this.tail;
        pos[1] = this.head;
        function simplex(indices) {
            var simplex = new Simplex(indices.length - 1);
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]];
            }
            return simplex;
        }
        this.data = [[0, 1]].map(function (line) { return simplex(line); });
        // Compute the meta data.
        this.check();
    };
    return Simplex1Geometry;
}(SimplexPrimitivesBuilder));
export { Simplex1Geometry };
