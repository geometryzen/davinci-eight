var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/CuboidChain', '../geometries/Geometry', '../dfx/toGeometryData'], function (require, exports, CuboidChain, Geometry, toGeometryData) {
    /**
     * @class CuboidGeometry
     */
    var CuboidGeometry = (function (_super) {
        __extends(CuboidGeometry, _super);
        /**
         * <p>
         * A CuboidGeometry represents the mathematical shape of a cuboid.
         * <p>
         * @class CuboidGeometry
         * @constructor
         * @param width {number} The length in the x-axis aspect.
         * @param height {number} The length in the y-axis aspect.
         * @param depth {number} The length in the z-axis aspect.
         */
        function CuboidGeometry(width, height, depth) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (depth === void 0) { depth = 1; }
            _super.call(this, void 0, void 0);
            this.x = width;
            this.y = height;
            this.z = depth;
            this.xSegments = 1;
            this.ySegments = 1;
            this.zSegments = 1;
            this.lines = true;
            this.calculate();
        }
        CuboidGeometry.prototype.calculate = function () {
            var complex = new CuboidChain(this.x, this.y, this.z, this.xSegments, this.ySegments, this.zSegments, this.lines);
            this.data = toGeometryData(complex.data, complex.meta);
            this.meta = complex.meta;
        };
        return CuboidGeometry;
    })(Geometry);
    return CuboidGeometry;
});
