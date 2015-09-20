var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/BoxComplex', '../geometries/Geometry', '../dfx/toGeometryData'], function (require, exports, BoxComplex, Geometry, toGeometryData) {
    /**
     * @class BoxGeometry
     */
    var BoxGeometry = (function (_super) {
        __extends(BoxGeometry, _super);
        /**
         * @class BoxGeometry
         * @constructor
         */
        function BoxGeometry() {
            _super.call(this, void 0, void 0);
            this.x = 1;
            this.y = 1;
            this.z = 1;
            this.xSegments = 1;
            this.ySegments = 1;
            this.zSegments = 1;
            this.lines = true;
        }
        BoxGeometry.prototype.calculate = function () {
            var complex = new BoxComplex(this.x, this.y, this.z, this.xSegments, this.ySegments, this.zSegments, this.lines);
            this.data = toGeometryData(complex.data, complex.meta);
            this.meta = complex.meta;
        };
        return BoxGeometry;
    })(Geometry);
    return BoxGeometry;
});
