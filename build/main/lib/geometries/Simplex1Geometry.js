"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var SimplexPrimitivesBuilder_1 = require("../geometries/SimplexPrimitivesBuilder");
var Simplex_1 = require("../geometries/Simplex");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Vector3_1 = require("../math/Vector3");
var Simplex1Geometry = /** @class */ (function (_super) {
    tslib_1.__extends(Simplex1Geometry, _super);
    function Simplex1Geometry() {
        var _this = _super.call(this) || this;
        _this.head = new Vector3_1.Vector3([1, 0, 0]);
        _this.tail = new Vector3_1.Vector3([0, 1, 0]);
        _this.calculate();
        return _this;
    }
    Simplex1Geometry.prototype.calculate = function () {
        var pos = [0, 1].map(function (index) { return void 0; });
        pos[0] = this.tail;
        pos[1] = this.head;
        function simplex(indices) {
            var simplex = new Simplex_1.Simplex(indices.length - 1);
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]];
            }
            return simplex;
        }
        this.data = [[0, 1]].map(function (line) { return simplex(line); });
        // Compute the meta data.
        this.check();
    };
    return Simplex1Geometry;
}(SimplexPrimitivesBuilder_1.SimplexPrimitivesBuilder));
exports.Simplex1Geometry = Simplex1Geometry;
