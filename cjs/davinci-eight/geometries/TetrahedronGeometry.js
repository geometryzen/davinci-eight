var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PolyhedronGeometry = require('../geometries/PolyhedronGeometry');
var vertices = [
    1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
];
var indices = [
    2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
];
var TetrahedronGeometry = (function (_super) {
    __extends(TetrahedronGeometry, _super);
    function TetrahedronGeometry(radius, detail) {
        _super.call(this, vertices, indices, radius, detail);
    }
    return TetrahedronGeometry;
})(PolyhedronGeometry);
module.exports = TetrahedronGeometry;
