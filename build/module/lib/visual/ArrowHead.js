import { __extends } from "tslib";
import { isDefined } from '../checks/isDefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { Mesh } from '../core/Mesh';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { ArrowHeadGeometry } from '../geometries/ArrowHeadGeometry';
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
var ArrowHead = /** @class */ (function (_super) {
    __extends(ArrowHead, _super);
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    function ArrowHead(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Arrow');
        var geoOptions = {};
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.heightCone = heightConeFromOptions(options, 0.20);
        geoOptions.radiusCone = radiusConeFromOptions(options, 0.08);
        geoOptions.thetaSegments = thetaSegmentsFromOptions(options, 16);
        var geometry = new ArrowHeadGeometry(contextManager, geoOptions);
        _this.geometry = geometry;
        geometry.release();
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (isDefined(options.length)) {
            _this.length = mustBeNumber('length', options.length);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     * @hidden
     */
    ArrowHead.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(ArrowHead.prototype, "vector", {
        /**
         * The vector that is represented by the Arrow.
         *
         * magnitude(Arrow.vector) = Arrow.length
         * direction(Arrow.vector) = Arrow.axis
         * Arrow.vector = Arrow.length * Arrow.axis
         */
        get: function () {
            return _super.prototype.getAxis.call(this).scale(this.length);
        },
        set: function (axis) {
            this.length = normVectorE3(axis);
            // Don't try to set the direction for the zero vector.
            if (this.length !== 0) {
                this.setAxis(axis);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowHead.prototype, "length", {
        /**
         * The length of the Arrow.
         * This property determines the scaling of the Arrow in all directions.
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (length) {
            this.setScale(length, length, length);
        },
        enumerable: false,
        configurable: true
    });
    return ArrowHead;
}(Mesh));
export { ArrowHead };
function heightConeFromOptions(options, defaultValue) {
    if (options) {
        if (typeof options.heightCone === 'number') {
            return options.heightCone;
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
}
function radiusConeFromOptions(options, defaultValue) {
    if (options) {
        if (typeof options.radiusCone === 'number') {
            return options.radiusCone;
        }
        else {
            return defaultValue;
        }
    }
    else {
        return defaultValue;
    }
}
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
