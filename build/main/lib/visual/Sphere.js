"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Color_1 = require("../core/Color");
var Defaults_1 = require("./Defaults");
var referenceAxis_1 = require("../core/referenceAxis");
var referenceMeridian_1 = require("../core/referenceMeridian");
var isDefined_1 = require("../checks/isDefined");
var geometryModeFromOptions_1 = require("./geometryModeFromOptions");
var materialFromOptions_1 = require("./materialFromOptions");
var Mesh_1 = require("../core/Mesh");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var offsetFromOptions_1 = require("./offsetFromOptions");
var setAxisAndMeridian_1 = require("./setAxisAndMeridian");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var SimplexMode_1 = require("../geometries/SimplexMode");
var simplexModeFromOptions_1 = require("./simplexModeFromOptions");
var SphereGeometry_1 = require("../geometries/SphereGeometry");
var spinorE3Object_1 = require("./spinorE3Object");
var vectorE3Object_1 = require("./vectorE3Object");
var RADIUS_NAME = 'radius';
/**
 *
 */
var Sphere = /** @class */ (function (_super) {
    tslib_1.__extends(Sphere, _super);
    /**
     *
     */
    function Sphere(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction(), meridian: referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Sphere');
        var geoMode = geometryModeFromOptions_1.geometryModeFromOptions(options);
        var geoOptions = { kind: 'SphereGeometry' };
        geoOptions.mode = geoMode;
        geoOptions.azimuthSegments = options.azimuthSegments;
        geoOptions.azimuthStart = options.azimuthStart;
        geoOptions.azimuthLength = options.azimuthLength;
        geoOptions.elevationLength = options.elevationLength;
        geoOptions.elevationSegments = options.elevationSegments;
        geoOptions.elevationStart = options.elevationStart;
        geoOptions.offset = offsetFromOptions_1.offsetFromOptions(options);
        geoOptions.stress = void 0;
        geoOptions.tilt = spinorE3Object_1.spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object_1.vectorE3Object(referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction());
        geoOptions.meridian = vectorE3Object_1.vectorE3Object(referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction());
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof SphereGeometry_1.SphereGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new SphereGeometry_1.SphereGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions_1.materialFromOptions(contextManager, simplexModeFromOptions_1.simplexModeFromOptions(options, SimplexMode_1.SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian_1.setAxisAndMeridian(_this, options);
        setColorOption_1.setColorOption(_this, options, options.textured ? Color_1.Color.white : Color_1.Color.gray);
        setDeprecatedOptions_1.setDeprecatedOptions(_this, options);
        _this.radius = isDefined_1.isDefined(options.radius) ? mustBeNumber_1.mustBeNumber(RADIUS_NAME, options.radius) : Defaults_1.ds.radius;
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
        enumerable: true,
        configurable: true
    });
    return Sphere;
}(Mesh_1.Mesh));
exports.Sphere = Sphere;
