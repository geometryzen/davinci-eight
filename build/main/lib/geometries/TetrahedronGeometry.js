"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var GeometryElements_1 = require("../core/GeometryElements");
var tetrahedronPrimitive_1 = require("./tetrahedronPrimitive");
/**
 * A convenience class for creating a tetrahedron geometry.
 */
var TetrahedronGeometry = (function (_super) {
    tslib_1.__extends(TetrahedronGeometry, _super);
    /**
     *
     */
    function TetrahedronGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'TetrahedronGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, tetrahedronPrimitive_1.tetrahedronPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('TetrahedronGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    TetrahedronGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('TetrahedronGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    TetrahedronGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return TetrahedronGeometry;
}(GeometryElements_1.GeometryElements));
exports.TetrahedronGeometry = TetrahedronGeometry;
