"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridXY = void 0;
var tslib_1 = require("tslib");
var expectOptions_1 = require("../checks/expectOptions");
var GeometryMode_1 = require("../geometries/GeometryMode");
var Grid_1 = require("./Grid");
var isDefined_1 = require("../checks/isDefined");
var mustBeFunction_1 = require("../checks/mustBeFunction");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var validate_1 = require("../checks/validate");
var R3_1 = require("../math/R3");
var ALLOWED_OPTIONS = ['xMin', 'xMax', 'xSegments', 'yMin', 'yMax', 'ySegments', 'z', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];
function mapOptions(options) {
    expectOptions_1.expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    var aPosition;
    if (isDefined_1.isDefined(options.z)) {
        mustBeFunction_1.mustBeFunction('z', options.z);
        aPosition = function (x, y) {
            return R3_1.vec(x, y, options.z(x, y));
        };
    }
    else {
        aPosition = function (x, y) {
            return R3_1.vec(x, y, 0);
        };
    }
    var uMin = validate_1.validate('xMin', options.xMin, -1, mustBeNumber_1.mustBeNumber);
    var uMax = validate_1.validate('xMax', options.xMax, +1, mustBeNumber_1.mustBeNumber);
    var uSegments = validate_1.validate('xSegments', options.xSegments, 10, mustBeInteger_1.mustBeInteger);
    var vMin = validate_1.validate('yMin', options.yMin, -1, mustBeNumber_1.mustBeNumber);
    var vMax = validate_1.validate('yMax', options.yMax, +1, mustBeNumber_1.mustBeNumber);
    var vSegments = validate_1.validate('ySegments', options.ySegments, 10, mustBeInteger_1.mustBeInteger);
    var mode = validate_1.validate('mode', options.mode, GeometryMode_1.GeometryMode.WIRE, mustBeInteger_1.mustBeInteger);
    return {
        uMin: uMin,
        uMax: uMax,
        uSegments: uSegments,
        vMin: vMin,
        vMax: vMax,
        vSegments: vSegments,
        aPosition: aPosition,
        mode: mode
    };
}
/**
 * A grid in the xy plane.
 */
var GridXY = /** @class */ (function (_super) {
    tslib_1.__extends(GridXY, _super);
    /**
     * Constructs a GridXY
     */
    function GridXY(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, mapOptions(options), levelUp + 1) || this;
        _this.setLoggingName('GridXY');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GridXY.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return GridXY;
}(Grid_1.Grid));
exports.GridXY = GridXY;
