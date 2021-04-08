import { __extends } from "tslib";
import { Color } from '../core/Color';
import { Mesh } from '../core/Mesh';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { ArrowTailGeometry } from '../geometries/ArrowTailGeometry';
import { SimplexMode } from '../geometries/SimplexMode';
import { normVectorE3 } from '../math/normVectorE3';
import { ds } from './Defaults';
import { materialFromOptions } from './materialFromOptions';
import { offsetFromOptions } from './offsetFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';
/**
 * @hidden
 */
var ArrowTail = /** @class */ (function (_super) {
    __extends(ArrowTail, _super);
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    function ArrowTail(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Arrow');
        var geoOptions = {};
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        _this.$heightShaft = heightShaftFromOptions(options, 0.80);
        geoOptions.heightShaft = _this.$heightShaft;
        geoOptions.radiusShaft = radiusShaftFromOptions(options, 0.01);
        geoOptions.thetaSegments = thetaSegmentsFromOptions(options, 16);
        var geometry = new ArrowTailGeometry(contextManager, geoOptions);
        _this.geometry = geometry;
        geometry.release();
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     * @hidden
     */
    ArrowTail.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(ArrowTail.prototype, "vector", {
        get: function () {
            return _super.prototype.getAxis.call(this).scale(this.heightShaft);
        },
        set: function (vector) {
            this.heightShaft = normVectorE3(vector);
            // Don't try to set the direction for the zero vector.
            if (this.heightShaft !== 0) {
                this.setAxis(vector);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowTail.prototype, "heightShaft", {
        get: function () {
            var s = this.getScaleY();
            return s * this.$heightShaft;
        },
        set: function (heightShaft) {
            var s = heightShaft / this.$heightShaft;
            this.setScale(1, s, 1);
        },
        enumerable: false,
        configurable: true
    });
    return ArrowTail;
}(Mesh));
export { ArrowTail };
/**
 * @hidden
 * @param options
 * @param defaultValue
 * @returns
 */
function heightShaftFromOptions(options, defaultValue) {
    if (options) {
        if (typeof options.heightShaft === 'number') {
            return options.heightShaft;
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
}
/**
 * @hidden
 * @param options
 * @param defaultValue
 * @returns
 */
function radiusShaftFromOptions(options, defaultValue) {
    if (options) {
        if (typeof options.radiusShaft === 'number') {
            return options.radiusShaft;
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
}
/**
 * @hidden
 * @param options
 * @param defaultValue
 * @returns
 */
function thetaSegmentsFromOptions(options, defaultValue) {
    if (options) {
        if (typeof options.thetaSegments === 'number') {
            return options.thetaSegments;
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
}
