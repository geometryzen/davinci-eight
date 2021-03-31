import { __extends } from "tslib";
import { isDefined } from '../checks/isDefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { Mesh } from '../core/Mesh';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { BoxGeometry } from '../geometries/BoxGeometry';
import { SimplexMode } from '../geometries/SimplexMode';
import { ds } from './Defaults';
import { geometryModeFromOptions } from './geometryModeFromOptions';
import { materialFromOptions } from './materialFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';
/**
 * A 3D visual representation of a box.
 */
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    function Box(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Box');
        var geoOptions = { kind: 'BoxGeometry' };
        geoOptions.mode = geometryModeFromOptions(options);
        geoOptions.offset = vectorE3Object(options.offset);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.openBack = options.openBack;
        geoOptions.openBase = options.openBase;
        geoOptions.openFront = options.openFront;
        geoOptions.openLeft = options.openLeft;
        geoOptions.openRight = options.openRight;
        geoOptions.openCap = options.openCap;
        var geometry = new BoxGeometry(contextManager, geoOptions);
        _this.geometry = geometry;
        geometry.release();
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, options.textured ? Color.white : Color.gray);
        setDeprecatedOptions(_this, options);
        if (isDefined(options.width)) {
            _this.width = mustBeNumber('width', options.width);
        }
        if (isDefined(options.height)) {
            _this.height = mustBeNumber('height', options.height);
        }
        if (isDefined(options.depth)) {
            _this.depth = mustBeNumber('depth', options.depth);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     * @hidden
     */
    Box.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Box.prototype, "width", {
        /**
         * @default 1
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (width) {
            var y = this.getScaleY();
            var z = this.getScaleZ();
            this.setScale(width, y, z);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "height", {
        /**
         *
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (height) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, height, z);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "depth", {
        /**
         *
         */
        get: function () {
            return this.getScaleZ();
        },
        set: function (depth) {
            var x = this.getScaleX();
            var y = this.getScaleY();
            this.setScale(x, y, depth);
        },
        enumerable: false,
        configurable: true
    });
    return Box;
}(Mesh));
export { Box };
