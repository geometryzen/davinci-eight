"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveGeometry = void 0;
var tslib_1 = require("tslib");
var GeometryElements_1 = require("../core/GeometryElements");
var curvePrimitive_1 = require("./curvePrimitive");
/**
 * A Geometry for representing functions of one scalar parameter.
 */
var CurveGeometry = /** @class */ (function (_super) {
    tslib_1.__extends(CurveGeometry, _super);
    function CurveGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'CurveGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, curvePrimitive_1.curvePrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('CurveGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    CurveGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('CurveGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    CurveGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return CurveGeometry;
}(GeometryElements_1.GeometryElements));
exports.CurveGeometry = CurveGeometry;
