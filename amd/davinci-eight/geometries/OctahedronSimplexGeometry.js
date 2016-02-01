var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/PolyhedronSimplexGeometry'], function (require, exports, PolyhedronSimplexGeometry_1) {
    var vertices = [
        1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1
    ];
    var indices = [
        0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2
    ];
    var OctahedronSimplexGeometry = (function (_super) {
        __extends(OctahedronSimplexGeometry, _super);
        function OctahedronSimplexGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return OctahedronSimplexGeometry;
    })(PolyhedronSimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = OctahedronSimplexGeometry;
});
