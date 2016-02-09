var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/AxialSimplexPrimitivesBuilder', '../checks/isDefined', '../checks/mustBeNumber', '../math/R3'], function (require, exports, AxialSimplexPrimitivesBuilder_1, isDefined_1, mustBeNumber_1, R3_1) {
    function perpendicular(axis) {
        return R3_1.default.random().cross(axis).direction();
    }
    var SliceSimplexGeometry = (function (_super) {
        __extends(SliceSimplexGeometry, _super);
        function SliceSimplexGeometry(axis, sliceStart, sliceAngle) {
            if (axis === void 0) { axis = R3_1.default.e3; }
            if (sliceAngle === void 0) { sliceAngle = 2 * Math.PI; }
            _super.call(this, axis);
            this.sliceAngle = 2 * Math.PI;
            if (isDefined_1.default(sliceStart)) {
                this.sliceStart = R3_1.default.copy(sliceStart).direction();
            }
            else {
                this.sliceStart = perpendicular(this.axis);
            }
            this.sliceAngle = mustBeNumber_1.default('sliceAngle', sliceAngle);
        }
        return SliceSimplexGeometry;
    })(AxialSimplexPrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SliceSimplexGeometry;
});
