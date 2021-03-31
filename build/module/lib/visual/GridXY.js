import { __extends } from "tslib";
import { expectOptions } from '../checks/expectOptions';
import { isDefined } from '../checks/isDefined';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { validate } from '../checks/validate';
import { GeometryMode } from '../geometries/GeometryMode';
import { vec } from '../math/R3';
import { Grid } from './Grid';
/**
 * @hidden
 */
var ALLOWED_OPTIONS = ['xMin', 'xMax', 'xSegments', 'yMin', 'yMax', 'ySegments', 'z', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];
/**
 * @hidden
 */
function mapOptions(options) {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    var aPosition;
    if (isDefined(options.z)) {
        mustBeFunction('z', options.z);
        aPosition = function (x, y) {
            return vec(x, y, options.z(x, y));
        };
    }
    else {
        aPosition = function (x, y) {
            return vec(x, y, 0);
        };
    }
    var uMin = validate('xMin', options.xMin, -1, mustBeNumber);
    var uMax = validate('xMax', options.xMax, +1, mustBeNumber);
    var uSegments = validate('xSegments', options.xSegments, 10, mustBeInteger);
    var vMin = validate('yMin', options.yMin, -1, mustBeNumber);
    var vMax = validate('yMax', options.yMax, +1, mustBeNumber);
    var vSegments = validate('ySegments', options.ySegments, 10, mustBeInteger);
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
 * A grid in the xy plane.
 */
var GridXY = /** @class */ (function (_super) {
    __extends(GridXY, _super);
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
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
     * @hidden
     */
    GridXY.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return GridXY;
}(Grid));
export { GridXY };
