var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeInteger', '../utils/Shareable', '../core/Symbolic'], function (require, exports, mustBeInteger, Shareable, Symbolic) {
    var LOGGING_NAME = 'PointSize';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class PointSize
     */
    var PointSize = (function (_super) {
        __extends(PointSize, _super);
        /**
         * @class PointSize
         * @constructor
         */
        function PointSize(pointSize) {
            if (pointSize === void 0) { pointSize = 2; }
            _super.call(this, 'PointSize');
            this.pointSize = mustBeInteger('pointSize', pointSize);
        }
        PointSize.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        PointSize.prototype.getProperty = function (name) {
            return void 0;
        };
        PointSize.prototype.setProperty = function (name, value) {
        };
        PointSize.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniform1f(Symbolic.UNIFORM_POINT_SIZE, this.pointSize, canvasId);
        };
        return PointSize;
    })(Shareable);
    return PointSize;
});
