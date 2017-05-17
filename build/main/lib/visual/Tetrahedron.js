"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Color_1 = require("../core/Color");
var Defaults_1 = require("./Defaults");
var materialFromOptions_1 = require("./materialFromOptions");
var Mesh_1 = require("../core/Mesh");
var offsetFromOptions_1 = require("./offsetFromOptions");
var referenceAxis_1 = require("../core/referenceAxis");
var referenceMeridian_1 = require("../core/referenceMeridian");
var setAxisAndMeridian_1 = require("./setAxisAndMeridian");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var SimplexMode_1 = require("../geometries/SimplexMode");
var simplexModeFromOptions_1 = require("./simplexModeFromOptions");
var TetrahedronGeometry_1 = require("../geometries/TetrahedronGeometry");
var spinorE3Object_1 = require("./spinorE3Object");
var vectorE3Object_1 = require("./vectorE3Object");
/**
 * A 3D visual representation of a tetrahedron.
 */
var Tetrahedron = (function (_super) {
    tslib_1.__extends(Tetrahedron, _super);
    function Tetrahedron(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction(), meridian: referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Tetrahedron');
        var geoOptions = { kind: 'TetrahedronGeometry' };
        geoOptions.offset = offsetFromOptions_1.offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object_1.spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object_1.vectorE3Object(referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction());
        geoOptions.meridian = vectorE3Object_1.vectorE3Object(referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction());
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof TetrahedronGeometry_1.TetrahedronGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new TetrahedronGeometry_1.TetrahedronGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions_1.materialFromOptions(contextManager, simplexModeFromOptions_1.simplexModeFromOptions(options, SimplexMode_1.SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian_1.setAxisAndMeridian(_this, options);
        setColorOption_1.setColorOption(_this, options, Color_1.Color.gray);
        setDeprecatedOptions_1.setDeprecatedOptions(_this, options);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Tetrahedron.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Tetrahedron.prototype, "radius", {
        /**
         *
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (radius) {
            this.setScale(radius, radius, radius);
        },
        enumerable: true,
        configurable: true
    });
    return Tetrahedron;
}(Mesh_1.Mesh));
exports.Tetrahedron = Tetrahedron;
