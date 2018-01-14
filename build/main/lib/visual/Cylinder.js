"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Color_1 = require("../core/Color");
var CylinderGeometry_1 = require("../geometries/CylinderGeometry");
var Defaults_1 = require("./Defaults");
var geometryModeFromOptions_1 = require("./geometryModeFromOptions");
var isDefined_1 = require("../checks/isDefined");
var materialFromOptions_1 = require("./materialFromOptions");
var Mesh_1 = require("../core/Mesh");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var offsetFromOptions_1 = require("./offsetFromOptions");
var referenceAxis_1 = require("../core/referenceAxis");
var referenceMeridian_1 = require("../core/referenceMeridian");
var setAxisAndMeridian_1 = require("./setAxisAndMeridian");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var SimplexMode_1 = require("../geometries/SimplexMode");
var simplexModeFromOptions_1 = require("./simplexModeFromOptions");
var spinorE3Object_1 = require("./spinorE3Object");
var vectorE3Object_1 = require("./vectorE3Object");
/**
 * A 3D visual representation of a cylinder.
 */
var Cylinder = /** @class */ (function (_super) {
    tslib_1.__extends(Cylinder, _super);
    /**
     *
     */
    function Cylinder(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction(), meridian: referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Cylinder');
        var geoOptions = { kind: 'CylinderGeometry' };
        geoOptions.mode = geometryModeFromOptions_1.geometryModeFromOptions(options);
        geoOptions.offset = offsetFromOptions_1.offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object_1.spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object_1.vectorE3Object(referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction());
        geoOptions.meridian = vectorE3Object_1.vectorE3Object(referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction());
        geoOptions.openCap = options.openCap;
        geoOptions.openBase = options.openBase;
        geoOptions.openWall = options.openWall;
        geoOptions.heightSegments = options.heightSegments;
        geoOptions.thetaSegments = options.thetaSegments;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof CylinderGeometry_1.CylinderGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new CylinderGeometry_1.CylinderGeometry(contextManager, geoOptions);
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
        _this.radius = isDefined_1.isDefined(options.radius) ? mustBeNumber_1.mustBeNumber('radius', options.radius) : Defaults_1.ds.radius;
        if (isDefined_1.isDefined(options.length)) {
            _this.length = mustBeNumber_1.mustBeNumber('length', options.length);
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
        enumerable: true,
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
        enumerable: true,
        configurable: true
    });
    return Cylinder;
}(Mesh_1.Mesh));
exports.Cylinder = Cylinder;
