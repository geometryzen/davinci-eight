var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../geometries/PolyhedronGeometry'], function (require, exports, PolyhedronGeometry) {
    var vertices = [
        1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1
    ];
    var indices = [
        0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2
    ];
    var OctahedronGeometry = (function (_super) {
        __extends(OctahedronGeometry, _super);
        function OctahedronGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return OctahedronGeometry;
    })(PolyhedronGeometry);
    return OctahedronGeometry;
});
