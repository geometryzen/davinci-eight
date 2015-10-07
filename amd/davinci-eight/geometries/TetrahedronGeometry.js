var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/PolyhedronGeometry'], function (require, exports, PolyhedronGeometry) {
    var vertices = [
        1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
    ];
    var indices = [
        2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
    ];
    /**
     * @class TetrahedronGeometry
     * @extends PolyhedronGeometry
     */
    var TetrahedronGeometry = (function (_super) {
        __extends(TetrahedronGeometry, _super);
        /**
         * @class TetrahedronGeometry
         * @constructor
         * @param radius [number]
         * @param detail [number]
         */
        function TetrahedronGeometry(radius, detail) {
            _super.call(this, vertices, indices, radius, detail);
        }
        return TetrahedronGeometry;
    })(PolyhedronGeometry);
    return TetrahedronGeometry;
});
