import { __extends } from "tslib";
import { Color } from '../core/Color';
import { CylinderGeometry } from '../geometries/CylinderGeometry';
import { ds } from './Defaults';
import { geometryModeFromOptions } from './geometryModeFromOptions';
import { isDefined } from '../checks/isDefined';
import { materialFromOptions } from './materialFromOptions';
import { Mesh } from '../core/Mesh';
import { mustBeNumber } from '../checks/mustBeNumber';
import { offsetFromOptions } from './offsetFromOptions';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { SimplexMode } from '../geometries/SimplexMode';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';
/**
 * A 3D visual representation of a cylinder.
 */
var Cylinder = /** @class */ (function (_super) {
    __extends(Cylinder, _super);
    /**
     *
     */
    function Cylinder(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Cylinder');
        var geoOptions = { kind: 'CylinderGeometry' };
        geoOptions.mode = geometryModeFromOptions(options);
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.openCap = options.openCap;
        geoOptions.openBase = options.openBase;
        geoOptions.openWall = options.openWall;
        geoOptions.heightSegments = options.heightSegments;
        geoOptions.thetaSegments = options.thetaSegments;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof CylinderGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new CylinderGeometry(contextManager, geoOptions);
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
        _this.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : ds.radius;
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
    Cylinder.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Cylinder.prototype, "length", {
        /**
         * The length of the cylinder, a scalar. Defaults to 1.
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (length) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, length, z);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cylinder.prototype, "radius", {
        /**
         * The radius of the cylinder, a scalar. Defaults to 1.
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (radius) {
            var y = this.getScaleY();
            this.setScale(radius, y, radius);
        },
        enumerable: false,
        configurable: true
    });
    return Cylinder;
}(Mesh));
export { Cylinder };
