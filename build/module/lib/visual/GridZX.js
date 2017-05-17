import * as tslib_1 from "tslib";
import { expectOptions } from '../checks/expectOptions';
import { GeometryMode } from '../geometries/GeometryMode';
import { Grid } from './Grid';
import { isDefined } from '../checks/isDefined';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { vec } from '../math/R3';
import { validate } from '../checks/validate';
var ALLOWED_OPTIONS = ['zMin', 'zMax', 'zSegments', 'xMin', 'xMax', 'xSegments', 'y', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];
function mapOptions(options) {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    var aPosition;
    if (isDefined(options.y)) {
        mustBeFunction('y', options.y);
        aPosition = function (z, x) {
            return vec(x, options.y(z, x), z);
        };
    }
    else {
        aPosition = function (z, x) {
            return vec(x, 0, z);
        };
    }
    var uMin = validate('zMin', options.zMin, -1, mustBeNumber);
    var uMax = validate('zMax', options.zMax, +1, mustBeNumber);
    var uSegments = validate('zSegments', options.zSegments, 10, mustBeInteger);
    var vMin = validate('xMin', options.xMin, -1, mustBeNumber);
    var vMax = validate('xMax', options.xMax, +1, mustBeNumber);
    var vSegments = validate('xSegments', options.xSegments, 10, mustBeInteger);
    var mode = validate('mode', options.mode, GeometryMode.WIRE, mustBeInteger);
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
var GridZX = (function (_super) {
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
}(Grid));
export { GridZX };
