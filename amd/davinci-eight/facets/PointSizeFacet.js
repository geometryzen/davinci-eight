define(["require", "exports", '../checks/mustBeArray', '../checks/mustBeInteger', '../checks/mustBeString', '../core/GraphicsProgramSymbols'], function (require, exports, mustBeArray_1, mustBeInteger_1, mustBeString_1, GraphicsProgramSymbols_1) {
    var LOGGING_NAME = 'PointSizeFacet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var PointSizeFacet = (function () {
        function PointSizeFacet(pointSize) {
            if (pointSize === void 0) { pointSize = 2; }
            this.pointSize = mustBeInteger_1.default('pointSize', pointSize);
        }
        PointSizeFacet.prototype.getProperty = function (name) {
            return void 0;
        };
        PointSizeFacet.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name, contextBuilder);
            mustBeArray_1.default('value', value, contextBuilder);
            return this;
        };
        PointSizeFacet.prototype.setUniforms = function (visitor) {
            visitor.uniform1f(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, this.pointSize);
        };
        return PointSizeFacet;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointSizeFacet;
});
