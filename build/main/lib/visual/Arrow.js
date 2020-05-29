"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arrow = void 0;
var tslib_1 = require("tslib");
var ArrowGeometry_1 = require("../geometries/ArrowGeometry");
var Color_1 = require("../core/Color");
var Defaults_1 = require("./Defaults");
var referenceAxis_1 = require("../core/referenceAxis");
var referenceMeridian_1 = require("../core/referenceMeridian");
var isDefined_1 = require("../checks/isDefined");
var materialFromOptions_1 = require("./materialFromOptions");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var Mesh_1 = require("../core/Mesh");
var normVectorE3_1 = require("../math/normVectorE3");
var offsetFromOptions_1 = require("./offsetFromOptions");
var setAxisAndMeridian_1 = require("./setAxisAndMeridian");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var SimplexMode_1 = require("../geometries/SimplexMode");
var simplexModeFromOptions_1 = require("./simplexModeFromOptions");
var spinorE3Object_1 = require("./spinorE3Object");
var vectorE3Object_1 = require("./vectorE3Object");
/**
 * A Mesh in the form of an arrow that may be used to represent a vector quantity.
 */
var Arrow = /** @class */ (function (_super) {
    tslib_1.__extends(Arrow, _super);
    /**
     *
     */
    function Arrow(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction(), meridian: referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Arrow');
        var geoOptions = { kind: 'ArrowGeometry' };
        geoOptions.offset = offsetFromOptions_1.offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object_1.spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object_1.vectorE3Object(referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction());
        geoOptions.meridian = vectorE3Object_1.vectorE3Object(referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction());
        geoOptions.radiusCone = 0.08;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof ArrowGeometry_1.ArrowGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new ArrowGeometry_1.ArrowGeometry(contextManager, geoOptions);
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
            this.length = normVectorE3_1.normVectorE3(axis);
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
}(Mesh_1.Mesh));
exports.Arrow = Arrow;
