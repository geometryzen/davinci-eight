"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var GeometryElements_1 = require("../core/GeometryElements");
var gridPrimitive_1 = require("./gridPrimitive");
/**
 * A Geometry for representing functions of two scalar parameters.
 */
var GridGeometry = /** @class */ (function (_super) {
    tslib_1.__extends(GridGeometry, _super);
    /**
     *
     */
    function GridGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'GridGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, gridPrimitive_1.gridPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('GridGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GridGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('GridGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    GridGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return GridGeometry;
}(GeometryElements_1.GeometryElements));
exports.GridGeometry = GridGeometry;
