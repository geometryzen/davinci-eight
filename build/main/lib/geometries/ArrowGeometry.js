"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var arrowPrimitive_1 = require("./arrowPrimitive");
var GeometryElements_1 = require("../core/GeometryElements");
/**
 * <p>
 * A convenience class for creating an arrow.
 * </p>
 * <p>
 * The initial axis unit vector defaults to <b>e<b><sub>2</sub>
 * </p>
 * <p>
 * The cutLine unit vector defaults to <b>e<b><sub>3</sub>
 * </p>
 */
var ArrowGeometry = /** @class */ (function (_super) {
    tslib_1.__extends(ArrowGeometry, _super);
    /**
     *
     */
    function ArrowGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'ArrowGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, arrowPrimitive_1.arrowPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('ArrowGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    ArrowGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ArrowGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    ArrowGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return ArrowGeometry;
}(GeometryElements_1.GeometryElements));
exports.ArrowGeometry = ArrowGeometry;
