import { __extends } from "tslib";
import { isDefined } from '../checks/isDefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { Mesh } from '../core/Mesh';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { SimplexMode } from '../geometries/SimplexMode';
import { SphereGeometry } from '../geometries/SphereGeometry';
import { ds } from './Defaults';
import { geometryModeFromOptions } from './geometryModeFromOptions';
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
var RADIUS_NAME = 'radius';
/**
 *
 */
var Sphere = /** @class */ (function (_super) {
    __extends(Sphere, _super);
    /**
     *
     */
    function Sphere(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Sphere');
        var geoMode = geometryModeFromOptions(options);
        var geoOptions = { kind: 'SphereGeometry' };
        geoOptions.mode = geoMode;
        geoOptions.azimuthSegments = options.azimuthSegments;
        geoOptions.azimuthStart = options.azimuthStart;
        geoOptions.azimuthLength = options.azimuthLength;
        geoOptions.elevationLength = options.elevationLength;
        geoOptions.elevationSegments = options.elevationSegments;
        geoOptions.elevationStart = options.elevationStart;
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.stress = void 0;
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.offset = offsetFromOptions(options);
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof SphereGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new SphereGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, options.textured ? Color.white : Color.gray);
        setDeprecatedOptions(_this, options);
        _this.radius = isDefined(options.radius) ? mustBeNumber(RADIUS_NAME, options.radius) : ds.radius;
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Sphere.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Sphere.prototype, "radius", {
        get: function () {
            return this.getScaleX();
        },
        set: function (radius) {
            this.setScale(radius, radius, radius);
        },
        enumerable: false,
        configurable: true
    });
    return Sphere;
}(Mesh));
export { Sphere };
