"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var expectOptions_1 = require("../checks/expectOptions");
var GeometryMode_1 = require("../geometries/GeometryMode");
var Grid_1 = require("./Grid");
var isDefined_1 = require("../checks/isDefined");
var mustBeFunction_1 = require("../checks/mustBeFunction");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var R3_1 = require("../math/R3");
var validate_1 = require("../checks/validate");
var ALLOWED_OPTIONS = ['zMin', 'zMax', 'zSegments', 'xMin', 'xMax', 'xSegments', 'y', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];
function mapOptions(options) {
    expectOptions_1.expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    var aPosition;
    if (isDefined_1.isDefined(options.y)) {
        mustBeFunction_1.mustBeFunction('y', options.y);
        aPosition = function (z, x) {
            return R3_1.vec(x, options.y(z, x), z);
        };
    }
    else {
        aPosition = function (z, x) {
            return R3_1.vec(x, 0, z);
        };
    }
    var uMin = validate_1.validate('zMin', options.zMin, -1, mustBeNumber_1.mustBeNumber);
    var uMax = validate_1.validate('zMax', options.zMax, +1, mustBeNumber_1.mustBeNumber);
    var uSegments = validate_1.validate('zSegments', options.zSegments, 10, mustBeInteger_1.mustBeInteger);
    var vMin = validate_1.validate('xMin', options.xMin, -1, mustBeNumber_1.mustBeNumber);
    var vMax = validate_1.validate('xMax', options.xMax, +1, mustBeNumber_1.mustBeNumber);
    var vSegments = validate_1.validate('xSegments', options.xSegments, 10, mustBeInteger_1.mustBeInteger);
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
 * A #d visual representation of a grid in the zx plane.
 */
var GridZX = /** @class */ (function (_super) {
    tslib_1.__extends(GridZX, _super);
    function GridZX(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, mapOptions(options), levelUp + 1) || this;
        _this.setLoggingName('GridZX');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    GridZX.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return GridZX;
}(Grid_1.Grid));
exports.GridZX = GridZX;
