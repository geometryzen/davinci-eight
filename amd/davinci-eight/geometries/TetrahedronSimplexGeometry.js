var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/PolyhedronSimplexGeometry'], function (require, exports, PolyhedronSimplexGeometry_1) {
    var vertices = [
        1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
    ];
    var indices = [
        2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
    ];
    var TetrahedronSimplexGeometry = (function (_super) {
        __extends(TetrahedronSimplexGeometry, _super);
        function TetrahedronSimplexGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return TetrahedronSimplexGeometry;
    })(PolyhedronSimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TetrahedronSimplexGeometry;
});
