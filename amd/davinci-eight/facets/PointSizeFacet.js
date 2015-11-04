var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeInteger', '../utils/Shareable', '../core/Symbolic'], function (require, exports, mustBeInteger, Shareable, Symbolic) {
    var LOGGING_NAME = 'PointSizeFacet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class PointSizeFacet
     */
    var PointSizeFacet = (function (_super) {
        __extends(PointSizeFacet, _super);
        /**
         * @class PointSizeFacet
         * @constructor
         * @param pointSize [number = 2]
         */
        function PointSizeFacet(pointSize) {
            if (pointSize === void 0) { pointSize = 2; }
            _super.call(this, 'PointSizeFacet');
            this.pointSize = mustBeInteger('pointSize', pointSize);
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
            visitor.uniform1f(Symbolic.UNIFORM_POINT_SIZE, this.pointSize, canvasId);
        };
        return PointSizeFacet;
    })(Shareable);
    return PointSizeFacet;
});
