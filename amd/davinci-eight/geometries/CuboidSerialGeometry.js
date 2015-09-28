var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/CuboidGeometry', '../geometries/SerialGeometry', '../dfx/toSerialGeometryElements'], function (require, exports, CuboidGeometry, SerialGeometry, toSerialGeometryElements) {
    /**
     * @class CuboidSerialGeometry
     */
    var CuboidSerialGeometry = (function (_super) {
        __extends(CuboidSerialGeometry, _super);
        /**
         * <p>
         * A CuboidSerialGeometry represents the mathematical shape of a cuboid.
         * <p>
         * @class CuboidSerialGeometry
         * @constructor
         * @param width {number} The length in the x-axis aspect.
         * @param height {number} The length in the y-axis aspect.
         * @param depth {number} The length in the z-axis aspect.
         */
        function CuboidSerialGeometry(width, height, depth) {
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
        CuboidSerialGeometry.prototype.calculate = function () {
            var complex = new CuboidGeometry(this.x, this.y, this.z, this.xSegments, this.ySegments, this.zSegments, this.lines);
            this.data = toSerialGeometryElements(complex.data, complex.meta);
            this.meta = complex.meta;
        };
        return CuboidSerialGeometry;
    })(SerialGeometry);
    return CuboidSerialGeometry;
});
