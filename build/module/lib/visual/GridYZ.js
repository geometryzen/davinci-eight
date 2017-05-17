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
var ALLOWED_OPTIONS = ['yMin', 'yMax', 'ySegments', 'zMin', 'zMax', 'zSegments', 'x', 'contextManager', 'engine', 'tilt', 'offset', 'mode'];
function mapOptions(options) {
    expectOptions(ALLOWED_OPTIONS, Object.keys(options));
    var aPosition;
    if (isDefined(options.x)) {
        mustBeFunction('x', options.x);
        aPosition = function (y, z) {
            return vec(options.x(y, z), y, z);
        };
    }
    else {
        aPosition = function (y, z) {
            return vec(0, y, z);
        };
    }
    var uMin = validate('yMin', options.yMin, -1, mustBeNumber);
    var uMax = validate('yMax', options.yMax, +1, mustBeNumber);
    var uSegments = validate('ySegments', options.ySegments, 10, mustBeInteger);
    var vMin = validate('zMin', options.zMin, -1, mustBeNumber);
    var vMax = validate('zMax', options.zMax, +1, mustBeNumber);
    var vSegments = validate('zSegments', options.zSegments, 10, mustBeInteger);
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
 * A grid in the yz plane.
 */
var GridYZ = (function (_super) {
    tslib_1.__extends(GridYZ, _super);
    /**
     * Constructs a GridYZ.
     */
    function GridYZ(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, mapOptions(options), levelUp + 1) || this;
        _this.setLoggingName('GridYZ');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GridYZ.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return GridYZ;
}(Grid));
export { GridYZ };
