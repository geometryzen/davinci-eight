var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeInteger', '../utils/Shareable', '../core/GraphicsProgramSymbols'], function (require, exports, mustBeInteger_1, Shareable_1, GraphicsProgramSymbols_1) {
    var LOGGING_NAME = 'PointSizeFacet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var PointSizeFacet = (function (_super) {
        __extends(PointSizeFacet, _super);
        function PointSizeFacet(pointSize) {
            if (pointSize === void 0) { pointSize = 2; }
            _super.call(this, 'PointSizeFacet');
            this.pointSize = mustBeInteger_1.default('pointSize', pointSize);
        }
        PointSizeFacet.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        PointSizeFacet.prototype.getProperty = function (name) {
            return void 0;
        };
        PointSizeFacet.prototype.setProperty = function (name, value) {
        };
        PointSizeFacet.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniform1f(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, this.pointSize, canvasId);
        };
        return PointSizeFacet;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointSizeFacet;
});
