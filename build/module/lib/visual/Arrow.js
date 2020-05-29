import { __extends } from "tslib";
import { ArrowGeometry } from '../geometries/ArrowGeometry';
import { Color } from '../core/Color';
import { ds } from './Defaults';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { isDefined } from '../checks/isDefined';
import { materialFromOptions } from './materialFromOptions';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Mesh } from '../core/Mesh';
import { normVectorE3 } from '../math/normVectorE3';
import { offsetFromOptions } from './offsetFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { SimplexMode } from '../geometries/SimplexMode';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';
/**
 * A Mesh in the form of an arrow that may be used to represent a vector quantity.
 */
var Arrow = /** @class */ (function (_super) {
    __extends(Arrow, _super);
    /**
     *
     */
    function Arrow(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Arrow');
        var geoOptions = { kind: 'ArrowGeometry' };
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.radiusCone = 0.08;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof ArrowGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new ArrowGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
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
     *
     */
    Arrow.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Arrow.prototype, "vector", {
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
    Object.defineProperty(Arrow.prototype, "length", {
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
    return Arrow;
}(Mesh));
export { Arrow };
