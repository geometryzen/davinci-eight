var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/SimplexPrimitivesBuilder', '../geometries/Simplex', '../core/GraphicsProgramSymbols', '../math/Vector3'], function (require, exports, SimplexPrimitivesBuilder_1, Simplex_1, GraphicsProgramSymbols_1, Vector3_1) {
    var Simplex1Geometry = (function (_super) {
        __extends(Simplex1Geometry, _super);
        function Simplex1Geometry() {
            _super.call(this);
            this.head = new Vector3_1.default([1, 0, 0]);
            this.tail = new Vector3_1.default([0, 1, 0]);
            this.calculate();
        }
        Simplex1Geometry.prototype.calculate = function () {
            var pos = [0, 1].map(function (index) { return void 0; });
            pos[0] = this.tail;
            pos[1] = this.head;
            function simplex(indices) {
                var simplex = new Simplex_1.default(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = pos[indices[i]];
                }
                return simplex;
            }
            this.data = [[0, 1]].map(function (line) { return simplex(line); });
            this.check();
        };
        return Simplex1Geometry;
    })(SimplexPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Simplex1Geometry;
});
